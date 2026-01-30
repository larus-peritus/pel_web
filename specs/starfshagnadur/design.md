# Hönnunarskjal: Starfshagnaðarmælir (Job Profit/Loss Scorecard)

## Yfirlit

### Markmið

Starfshagnaðarmælirinn er nýr kjarnareiknivél fyrir peninganaedalifid.is appið sem hjálpar notendum að meta hvort starf þeirra sé í raun arðbært. Með því að taka inn tekjur, allan starfstengdan kostnað, og allan tíma tengdan starfinu (þar á meðal undirbúning, endurhlaðningu, og ferðatíma), reiknar kerfið "raunverulegt tímakaup" og metur arðsemi starfsins.

### Lykiltölur

- **9 React íhlutir**: Frá JobProfitDashboard niður í form og birting íhluti
- **13 útreikningsaðferðir**: Pure functions fyrir arðsemisútreikninga
- **8 TypeScript gagnalíkön**: Fyrir tekjur, útgjöld, tíma, niðurstöður
- **5 arðsemisstig**: Frá "excellent" til "loss" með litakóðun
- **6 útgjaldaflokkar**: Fatnaður, máltíðir, búnaður, menntun, aðild, annað
- **5 atburðarás tegundir**: Núverandi, hlutastarf 75%, hlutastarf 50%, annað starf, sjálfstætt

### Lykilhönnunarákvarðanir

1. **Stækka CalculatorContext**: Job profit data bætt við núverandi context í stað nýs context. Gerir kleift að deila actualHourlyWage og fylgja núverandi mynstri (eins og subscription feature).

2. **Pure function útreikningar**: Allir útreikningar eru pure functions án side effects. Gerir prófanir einfaldar og afköst frábær.

3. **Client-side eingöngu**: Engar netbeiðnir, allir útreikningar í vafra. Uppfyllir persónuverndarkröfur og gerir app hraðvirkara.

4. **Incremental localStorage**: 500ms debounce á auto-save. Kemur í veg fyrir of margar skrifaaðgerðir en veitir samt "realtime" upplifun.

5. **Version 2 migration**: Storage schema uppfært í version 2 með `jobProfitData` optional field fyrir afturvirka samhæfni.

### Tækniyfirlit

| Lag | Tækni | Staðsetning |
|-----|-------|-------------|
| **Gagnalíkön** | TypeScript interfaces | `src/types/jobProfit.ts` |
| **Útreikningar** | Pure functions | `src/lib/calculations/jobProfit.ts` |
| **Stöðustjórnun** | React Context + hooks | `src/context/CalculatorContext.tsx` (uppfært) |
| **UI Íhlutir** | React 18 + TypeScript | `src/components/jobProfit/` |
| **Geymsla** | localStorage + JSON export | Sama lykill: `actual-hourly-wage-calculator` |
| **Prófanir** | Vitest + RTL | `__tests__/` í viðeigandi möppum |

### Helstu eiginleikar

1. **Tekjuskráning**: Brúttó laun, bónusar, fríðindi
2. **Útgjaldaskráning**: Listi af starfstengdum útgjöldum með flokkum og forstilltum gildum
3. **Tímaskráning**: Vinnustundir, yfirvinna, undirbúningur, endurhlaðning, ferðatími
4. **Arðsemismat**: Raunverulegt tímakaup vs opinbert, arðsemisstig með litakóðun
5. **Sundurliðun**: Myndræn birting á útgjöldum og tíma eftir flokkum
6. **Atburðarás samanburður**: Bera saman núverandi starf við hlutastarf eða annað starf
7. **Tillögur**: Snjölluð greining með tillögum til að bæta arðsemi
8. **Gagnageymsla**: Auto-save í localStorage, export/import til JSON

### Samþætting við núverandi app

Starfshagnaðarmælirinn samþættist fullkomlega við núverandi app:

- **Deildur context**: Notar sama CalculatorContext og actual wage og subscription features
- **Deildur UI íhlutir**: Notar Input, Select, Button, Card frá `src/components/ui/`
- **Deildir útreikningar**: Notar `formatCurrency`, `formatNumber` frá utils
- **Deildur geymsla**: Sama localStorage lykill, sama export/import mynstur
- **Deildur prófunarrammi**: Vitest + React Testing Library

### Næstu skref

Eftir samþykki hönnunar:

1. **Útfæra gagnalíkön**: Búa til TypeScript interfaces í `src/types/jobProfit.ts`
2. **Útfæra útreikningar**: Búa til pure functions í `src/lib/calculations/jobProfit.ts`
3. **Uppfæra Context**: Bæta job profit state og methods við CalculatorContext
4. **Búa til UI íhluti**: Útfæra alla 9 React components
5. **Skrifa prófanir**: Unit tests, component tests, integration tests
6. **Prófunarkeyrslur**: Manual testing á öllum user stories
7. **Accessibility prófanir**: Screen reader testing, keyboard navigation
8. **Deployment**: Merge til production

---

## Byggingarkerfi (Architecture)

### Yfirlit kerfis

Starfshagnaðarmælirinn er nýr kjarnareiknivél sem bætist við peninganaedalifid.is appið. Hann byggir á sömu grunnarkitektúr og núverandi "Raunverulegt Tímakaup" reiknivélin en stækkar hana með ítarlegri sundurliðun starfstengds kostnaðar og tíma, auk getu til að meta arðsemi starfs.

**Lykilhugmynd**: Notandi getur skráð allar tekjur og allan kostnað tengdan starfi, og sér þá "raunverulegt tímakaup" eftir allan kostnað. Kerfið metur síðan hvort starfið sé arðbært með því að bera saman við markmiðs tímakaup.

### Íhlutalög (Component Architecture)

Kerfið skiptist í fjögur aðal lög sem fylgja núverandi arkitektúr appsins:

1. **Gagnalag (Data Layer)**
   - **Ábyrgð**: Gagnalíkön, TypeScript viðmót, staðfestingarreglur
   - **Staðsetning**: `src/types/jobProfit.ts`
   - **Tengsl**: Vísar í `calculator.ts` fyrir sameiginleg viðmót

2. **Reiknilög (Calculation Layer)**
   - **Ábyrgð**: Allir útreikningar fyrir arðsemi, tímakaup, sundurliðun
   - **Staðsetning**: `src/lib/calculations/jobProfit.ts`
   - **Tengsl**: Notar `wage.ts` og `breakdown.ts` aðferðir

3. **Stöðustjórnunarlög (State Management Layer)**
   - **Ábyrgð**: Samþætting við CalculatorContext, localStorage, útflutningur/innflutningur
   - **Staðsetning**: Stækka `src/context/CalculatorContext.tsx`
   - **Tengsl**: Notar núverandi context mynstur

4. **UI Lag (UI Layer)**
   - **Ábyrgð**: React íhlutir fyrir inntak, birting, samanburð
   - **Staðsetning**: `src/components/jobProfit/`
   - **Tengsl**: Notar sameiginlega UI íhluti frá `src/components/ui/`

### Gagnaflæði (Data Flow)

```
Notandi → JobProfitForm íhlutir → CalculatorContext
                ↓
      updateJobProfitData()
                ↓
      Reiknivélaraðferðir (calculateJobProfitability, etc.)
                ↓
      CalculationResults viðmót
                ↓
      JobProfitResults íhlutir → Birting á skjá
                ↓
      localStorage (sjálfvirk vistun eftir 500ms)
```

**Gagnastefna**:
1. Notandi slær inn tekjur, útgjöld, tíma í form
2. Context uppfærir stöðu samstundis (optimistic update)
3. Útreikningar keyrast samstundis (client-side, engar netbeiðnir)
4. Niðurstöður uppfærast samstundis með React state
5. Gögn vistuð í localStorage með 500ms debounce
6. Export/import virkni fylgir núverandi mynstri

### Samþættingarpunktar (Integration Points)

1. **CalculatorContext** (Núverandi)
   - Viðbót: `jobProfitData` stöðu
   - Viðbót: `updateJobProfitData()` aðferð
   - Viðbót: `jobProfitResults` derived state
   - Haldið: Núverandi interface án brota

2. **localStorage** (Núverandi)
   - Viðbót: `jobProfitData` í StoredState viðmót
   - Lykill: Haldið núverandi `actual-hourly-wage-calculator`
   - Útgáfa: Bæta við migration fyrir version 2

3. **Export/Import** (Núverandi)
   - Viðbót: Job profit gögn í JSON útflutning
   - Snið: Sama JSON snið, ný svæði
   - Samhæfni: Afturvirk samhæfni með version checking

### Tæknistafla (Technology Stack)

| Tækni | Notkun | Rökstuðningur |
|-------|--------|---------------|
| **TypeScript** | Type-safe gagnalíkön og viðmót | Núverandi val, tryggir type safety |
| **React 18+** | UI íhlutir með hooks | Núverandi val, fylgir appinu |
| **React Context** | Stöðustjórnun | Núverandi mynstur í appinu |
| **localStorage** | Client-side gagnageymsla | Núverandi val, uppfyllir persónuverndarreglur |
| **Pure Functions** | Útreikningar | Núverandi mynstur, auðvelt að prófa |
| **Vitest** | Unit testing | Núverandi testing framework |
| **React Testing Library** | Component testing | Núverandi testing framework |

**Engar nýjar dependencies**: Allir íhlutir byggja á núverandi tæknistafla.

### Hönnunarákvarðanir - Arkitektúr

#### Ákvörðun 1: Stækka CalculatorContext vs. Nýtt Context

**Samhengi**: Þurfum að ákveða hvort bæta job profit data við núverandi CalculatorContext eða búa til nýtt JobProfitContext.

**Valkostir**:

1. **Stækka núverandi CalculatorContext**
   - Kostir:
     - Eitt samræmt viðmót fyrir allar reiknivélar
     - Deilir actualHourlyWage gildi með job profit útreikningum
     - Samræmdur export/import
     - Minni kóðatvöföldun
   - Gallar:
     - Stærra context viðmót
     - Meiri flækjustig í einu context
   - Áhætta: Context gæti orðið of stórt, en viðráðanlegt með góðri skipulagningu

2. **Búa til nýtt JobProfitContext**
   - Kostir:
     - Aðskilnaður áhyggjuefna (separation of concerns)
     - Minni context per feature
   - Gallar:
     - Þarf tvö context í appinu
     - Erfitt að deila gildum milli contexts
     - Tvöföldun á export/import logic
     - Ósamræmi við núverandi mynstur
   - Áhætta: Flækir stöðustjórnun

**Ákvörðun**: Stækka núverandi CalculatorContext

**Rökstuðningur**:
- Job profit feature þarf að deila `actualHourlyWage` úr aðal reiknivélinni
- Subscription feature notaði sömu nálgun með góðum árangri
- Samræmist núverandi appamynstri
- Einfaldari export/import logic
- Ein source of truth fyrir öll calculator gögn

**Áhrif**:
- CalculatorContext viðmót stækkar (en er enn viðráðanlegt)
- Þurfum að uppfæra CalculatorContext með nýjum methods og state
- localStorage schema version bumpast í 2

**Kröfur sem þetta uppfyllir**: REQ-NS-8 (samanburður við actual wage)

## Íhlutir og viðmót (Components and Interfaces)

### 1. JobProfitIncomeForm

**Tilgangur**: Form íhlutur fyrir inntak á tekjum starfs (laun, bónusar, fríðindi)

**Ábyrgð**:
- Birta innsláttar reiti fyrir brúttó árslaun, bónusa, fríðindi
- Staðfesta inntak (> 0 fyrir laun, >= 0 fyrir annað)
- Uppfæra context með `updateJobProfitIncome()`
- Sýna villur ef inntak er ógilt

**Opinbert viðmót**:
```tsx
interface JobProfitIncomeFormProps {
  income: JobProfitIncome;
  errors?: Record<string, string>;
  onChange: (income: Partial<JobProfitIncome>) => void;
}
```

**Tengsl**:
- Notar: `Input` frá `src/components/ui/Input`
- Notar: `Card` frá `src/components/ui/Card`
- Uppfærir: `CalculatorContext.updateJobProfitIncome()`

**Útfærsluathugasemdir**:
- Fylgir sama mynstri og `IncomeInputs.tsx`
- Allur texti á íslensku
- Árleg tölur (ekki mánaðarleg eins og aðal reiknivél)
- Real-time validation með villuboðum

---

### 2. JobProfitExpenseList

**Tilgangur**: Listi yfir öll útgjöld tengd starfi með getu til að bæta við, breyta og eyða

**Ábyrgð**:
- Birta lista yfir öll útgjöld
- Leyfa notanda að bæta við nýju útgjaldi
- Leyfa notanda að breyta fyrirliggjandi útgjaldi
- Leyfa notanda að eyða útgjaldi
- Sýna samtölu útgjalda eftir flokkum
- Bjóða upp á forstillt útgjöld (quick presets)

**Opinbert viðmót**:
```tsx
interface JobProfitExpenseListProps {
  expenses: JobProfitExpense[];
  onAdd: (expense: Omit<JobProfitExpense, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<JobProfitExpense>) => void;
  onDelete: (id: string) => void;
}
```

**Tengsl**:
- Notar: `JobProfitExpenseForm` fyrir add/edit modal
- Notar: `Card`, `Button` frá UI components
- Uppfærir: `CalculatorContext.addJobExpense()`, etc.

**Útfærsluathugasemdir**:
- Fylgir sama mynstri og `SubscriptionList.tsx`
- Raðað eftir kostnaði (hæst fyrst)
- Sýnir flokkasundurliðun
- Forstillt útgjöld fyrir íslenskan markað

---

### 3. JobProfitExpenseForm

**Tilgangur**: Modal form fyrir að bæta við eða breyta útgjaldi

**Ábyrgð**:
- Birta form fyrir nafn, kostnað, flokk
- Bjóða upp á forstillt gildi (vinnufatnaður, hádegismáltíðir, etc.)
- Staðfesta inntak
- Vista eða hætta við

**Opinbert viðmót**:
```tsx
interface JobProfitExpenseFormProps {
  mode: 'add' | 'edit';
  expense?: JobProfitExpense;
  onSave: (expense: Omit<JobProfitExpense, 'id'>) => void;
  onCancel: () => void;
}
```

**Tengsl**:
- Notar: `Input`, `Select`, `Button`, `Card` frá UI components
- Notar: `JOB_EXPENSE_PRESETS` frá constants

**Útfærsluathugasemdir**:
- Nákvæmlega sama mynstur og `SubscriptionForm.tsx`
- Staðfesting: nafn required, kostnaður > 0
- Flokkar: clothing, meals, equipment, education, membership, other

---

### 4. JobProfitTimeForm

**Tilgangur**: Form fyrir inntak á tíma tengdum starfi

**Ábyrgð**:
- Birta innsláttar reiti fyrir vinnustundir, yfirvinnu, undirbúning, endurhlaðningu, ferðatíma
- Umbreyta mínútum í klukkustundir þar sem við á
- Reikna heildar vinnustundir á viku
- Sýna samanburð milli opinbers tíma og raunverulegs tíma

**Opinbert viðmót**:
```tsx
interface JobProfitTimeFormProps {
  time: JobProfitTime;
  errors?: Record<string, string>;
  onChange: (time: Partial<JobProfitTime>) => void;
}
```

**Tengsl**:
- Notar: `Input`, `Card` frá UI components
- Uppfærir: `CalculatorContext.updateJobProfitTime()`

**Útfærsluathugasemdir**:
- Fylgir mynstri `TimeInputs.tsx`
- Undirbúning, endurhlaðning, ferðatími sleginn inn í mínútum per dag
- Umbreytir í klukkustundir per viku fyrir útreikninga
- Sýnir samanburð: "Opinber: 40 klst, Raunverulegur: 56 klst"

---

### 5. JobProfitabilityDisplay

**Tilgangur**: Aðalbirting á arðsemisútreikningum og lykilniðurstöðum

**Ábyrgð**:
- Sýna raunverulegt tímakaup eftir allan kostnað
- Sýna opinbert tímakaup til samanburðar
- Sýna arðsemisstig með litakóðun
- Sýna heildar tekjur, útgjöld, nettó tekjur
- Sýna heildar vinnustundir

**Opinbert viðmót**:
```tsx
interface JobProfitabilityDisplayProps {
  results: JobProfitResults;
  targetHourlyWage?: number;
}
```

**Tengsl**:
- Notar: `Card`, `MetricCard` frá UI components
- Notar: `formatCurrency`, `formatNumber` frá utils

**Útfærsluathugasemdir**:
- Litakóðun:
  - Grænt: arðsemisstig >= 100%
  - Gult: 75-99%
  - Rautt: < 75%
- Stórir, auðlesanlegir tölur
- Skýr samanburður milli opinbers og raunverulegs tímakaupsm

---

### 6. JobProfitBreakdownCharts

**Tilgangur**: Myndræn birting á sundurliðun útgjalda og tíma

**Ábyrgð**:
- Birta sundurliðun útgjalda eftir flokkum (bar chart eða pie chart)
- Birta sundurliðun tíma eftir tegundum
- Sýna prósentur og krónutölur/klukkustundir
- Raða eftir stærð (stærst fyrst)

**Opinbert viðmót**:
```tsx
interface JobProfitBreakdownChartsProps {
  expenseBreakdown: JobExpenseBreakdownItem[];
  timeBreakdown: JobTimeBreakdownItem[];
}
```

**Tengsl**:
- Notar: `Card` frá UI components
- Notar: Sama chart pattern og `BreakdownChart.tsx`

**Útfærsluathugasemdir**:
- Einfaldur bar chart (engar external chart libraries)
- CSS-based progress bars
- Responsive design
- Tooltip með nákvæmum gildum

---

### 7. JobProfitScenarioComparison

**Tilgangur**: Samanburður á mismunandi atburðarás (hlutastarf, annað starf, etc.)

**Ábyrgð**:
- Leyfa notanda að velja atburðarás
- Reikna nýjar niðurstöður fyrir atburðarás
- Sýna samanburð hlið við hlið
- Leyfa notanda að vista atburðarás

**Opinbert viðmót**:
```tsx
interface JobProfitScenarioComparisonProps {
  currentResults: JobProfitResults;
  scenarios: JobProfitScenario[];
  onCreateScenario: (type: ScenarioType) => void;
  onSaveScenario: (scenario: JobProfitScenario) => void;
}
```

**Tengsl**:
- Notar: `Card`, `Button`, `Select` frá UI components
- Notar: `calculateScenario()` frá calculations

**Útfærsluathugasemdir**:
- Atburðarás tegundir:
  - Núverandi staða (baseline)
  - Hlutastarf 75%
  - Hlutastarf 50%
  - Annað starf (custom input)
  - Sjálfstætt starfandi (custom input)
- Hlið við hlið tafla
- Litakóðun á breytingum (grænn = bæting, rauður = versnun)

---

### 8. JobProfitRecommendations

**Tilgangur**: Snjölluð tillögur til að bæta arðsemi starfs

**Ábyrgð**:
- Greina gögn notanda
- Finna tækifæri til að bæta (draga úr útgjöldum, semja um laun, etc.)
- Raða tillögum eftir áhrifum
- Sýna áætlaða bætur fyrir hverja tillögu

**Opinbert viðmót**:
```tsx
interface JobProfitRecommendationsProps {
  results: JobProfitResults;
  expenses: JobProfitExpense[];
  time: JobProfitTime;
}
```

**Tengsl**:
- Notar: `Card`, `Alert` frá UI components
- Notar: `generateRecommendations()` frá calculations

**Útfærsluathugasemdir**:
- Reglur fyrir tillögur (sjá NS-8 í requirements):
  - Hádegismáltíðir > 30% af útgjöldum → "Taka mat að heiman"
  - Endurhlaðning > 2 klst/dag → "Starf gæti verið of stressandi"
  - Yfirvinna > 10 klst/viku → "Semja um hærri laun"
  - Ferðatími > 1 klst/dag → "Leita að vinnu nær heimili"
  - Raunverulegt tímakaup < 0 → "Finna annað starf"
- Raðað eftir fjárhagslegum áhrifum
- Skýr aðgerðartillögur

---

### 9. JobProfitDashboard

**Tilgangur**: Aðal dashboard sem samþættir alla íhluti

**Ábyrgð**:
- Samræma alla sub-components
- Stýra navigation milli kafla
- Birta loading states
- Birta villur

**Opinbert viðmót**:
```tsx
interface JobProfitDashboardProps {
  // Notar CalculatorContext, engar props
}
```

**Tengsl**:
- Notar: Alla ofangreinda íhluti
- Notar: `useCalculator()` hook fyrir context

**Útfærsluathugasemdir**:
- Tab-based navigation eða accordion fyrir kafla
- Responsive layout
- Leiðsagnarflæði fyrir nýja notendur
- Sýnir áminningar ef gögn vantar

---

### Íhluta stigveldi (Component Hierarchy)

```
JobProfitDashboard
├── JobProfitIncomeForm
├── JobProfitExpenseList
│   └── JobProfitExpenseForm (modal)
├── JobProfitTimeForm
├── JobProfitabilityDisplay
├── JobProfitBreakdownCharts
├── JobProfitScenarioComparison
└── JobProfitRecommendations
```

### Deildir UI íhlutir (Shared UI Components)

Allir job profit íhlutir nota núverandi UI íhluti úr `src/components/ui/`:

- `Input` - Innsláttar reitir
- `Select` - Dropdown valmyndir
- `Button` - Hnappar
- `Card` / `CardHeader` / `CardContent` / `CardFooter` - Kort layout
- `Alert` - Viðvaranir og meddelingar

**Engar nýjar UI primitive íhlutir nauðsynlegir** - allt byggir á því sem er til staðar.

## Gagnalíkön (Data Models)

Öll gagnalíkön skilgreind í `src/types/jobProfit.ts` sem TypeScript viðmót.

### 1. JobProfitIncome

**Tilgangur**: Tekjuupplýsingar starfs

**Eiginleikar**:
```typescript
interface JobProfitIncome {
  grossAnnualSalary: number;      // Brúttó árslaun í ISK (áskilið, > 0)
  annualBonuses: number;          // Árlegir bónusar í ISK (>= 0)
  benefitsValue: number;          // Peningalegt gildi fríðinda í ISK (>= 0)
}
```

**Staðfestingarreglur**:
- `grossAnnualSalary`: Áskilið, verður að vera > 0, max 100,000,000 ISK
- `annualBonuses`: >= 0, max 50,000,000 ISK
- `benefitsValue`: >= 0, max 20,000,000 ISK

**Sambandleg gögn**: Engin

**Geymslustefna**: Vista í `jobProfitData.income` í CalculatorContext

---

### 2. JobProfitExpense

**Tilgangur**: Einstakt útgjald tengt starfi

**Eiginleikar**:
```typescript
interface JobProfitExpense {
  id: string;                     // Einstakt auðkenni
  name: string;                   // Nafn útgjalds (max 100 stafir)
  annualCost: number;             // Árlegur kostnaður í ISK (> 0)
  category: JobExpenseCategory;   // Flokkur
}

type JobExpenseCategory =
  | 'clothing'      // Fatnaður
  | 'meals'         // Máltíðir
  | 'equipment'     // Búnaður
  | 'education'     // Menntun
  | 'membership'    // Aðild/Leyfi
  | 'other';        // Annað
```

**Staðfestingarreglur**:
- `id`: Sjálfvirkt generað með `generateJobExpenseId()`
- `name`: Áskilið, ekki tómt, max 100 stafir
- `annualCost`: Áskilið, > 0, max 5,000,000 ISK
- `category`: Áskilið, einn af skilgreindum flokkum

**Sambandleg gögn**: Er hluti af fylki `jobProfitData.expenses[]`

**Geymslustefna**: Fylki í `jobProfitData.expenses` í CalculatorContext

---

### 3. JobProfitTime

**Tilgangur**: Tímakostnaður tengdur starfi

**Eiginleikar**:
```typescript
interface JobProfitTime {
  weeklyWorkHours: number;              // Opinber vinnustundir á viku (> 0)
  weeklyUnpaidOvertime: number;         // Ótölduð yfirvinna á viku (>= 0)
  dailyPrepTimeMinutes: number;         // Undirbúningstími á dag í mínútum (>= 0)
  dailyRecoveryTimeMinutes: number;     // Endurhlaðningartími á dag í mínútum (>= 0)
  dailyCommuteTimeMinutes: number;      // Ferðatími til og frá vinnu í mínútum (>= 0)
}
```

**Staðfestingarreglur**:
- `weeklyWorkHours`: Áskilið, > 0, max 100 klst
- `weeklyUnpaidOvertime`: >= 0, max 80 klst
- `dailyPrepTimeMinutes`: >= 0, max 300 mínútur (5 klst)
- `dailyRecoveryTimeMinutes`: >= 0, max 480 mínútur (8 klst)
- `dailyCommuteTimeMinutes`: >= 0, max 360 mínútur (6 klst)

**Útreikningar**:
```typescript
// Umbreyta daglegum mínútum í vikulegar klukkustundir (5 vinnudagar)
weeklyPrepHours = (dailyPrepTimeMinutes / 60) * 5
weeklyRecoveryHours = (dailyRecoveryTimeMinutes / 60) * 5
weeklyCommuteHours = (dailyCommuteTimeMinutes / 60) * 5

// Heildar vinnustundir á viku
totalWeeklyHours = weeklyWorkHours + weeklyUnpaidOvertime +
                   weeklyPrepHours + weeklyRecoveryHours + weeklyCommuteHours
```

**Sambandleg gögn**: Engin

**Geymslustefna**: Vista í `jobProfitData.time` í CalculatorContext

---

### 4. JobProfitResults

**Tilgangur**: Niðurstöður útreikninga á starfsarðsemi

**Eiginleikar**:
```typescript
interface JobProfitResults {
  // Tekjur
  totalAnnualIncome: number;            // Heildar árstekjur (laun + bónusar + fríðindi)

  // Útgjöld
  totalAnnualExpenses: number;          // Heildar ársútgjöld

  // Nettó
  netAnnualIncome: number;              // Nettó árstekjur (tekjur - útgjöld)

  // Tími
  totalWeeklyHours: number;             // Heildar vinnustundir á viku
  totalAnnualHours: number;             // Heildar vinnustundir á ári (52 vikur)

  // Tímakaup
  nominalHourlyWage: number;            // Opinbert tímakaup (tekjur / opinber tími)
  actualHourlyWage: number;             // Raunverulegt tímakaup (nettó tekjur / heildar tími)
  hourlyWageReduction: number;          // Mismunur í prósentum

  // Arðsemi
  profitabilityScore: number;           // Arðsemisstig (actual / target * 100)
  profitabilityLevel: ProfitabilityLevel; // Flokkun (excellent, good, fair, poor, loss)

  // Sundurliðun
  expenseBreakdown: JobExpenseBreakdownItem[];
  timeBreakdown: JobTimeBreakdownItem[];
}

type ProfitabilityLevel =
  | 'excellent'   // >= 125% (grænt)
  | 'good'        // 100-124% (grænt)
  | 'fair'        // 75-99% (gult)
  | 'poor'        // 50-74% (appelsínugult)
  | 'loss';       // < 50% (rautt)
```

**Staðfestingarreglur**: Engar (derived data)

**Sambandleg gögn**:
- Reiknaðar niðurstöður frá `JobProfitIncome`, `JobProfitExpense[]`, `JobProfitTime`

**Geymslustefna**: Ekki vistað beint (reiknaðar niðurstöður), en cached í context

---

### 5. JobExpenseBreakdownItem

**Tilgangur**: Sundurliðun á einstöku útgjaldi fyrir charts

**Eiginleikar**:
```typescript
interface JobExpenseBreakdownItem {
  category: JobExpenseCategory;   // Flokkur útgjalds
  label: string;                  // Íslensku heiti (t.d. "Fatnaður")
  amount: number;                 // Heildarupphæð í ISK
  percentage: number;             // Prósenta af heildar útgjöldum
  count: number;                  // Fjöldi útgjalda í þessum flokki
}
```

**Staðfestingarreglur**: Engar (derived data)

**Útreikningar**:
```typescript
// Fyrir hvern flokk:
amount = sum af öllum expenses með sama category
percentage = (amount / totalAnnualExpenses) * 100
count = fjöldi expenses með sama category
```

**Sambandleg gögn**: Afleidd úr `JobProfitExpense[]`

**Geymslustefna**: Ekki vistað (computed on-the-fly)

---

### 6. JobTimeBreakdownItem

**Tilgangur**: Sundurliðun á tímanotkun fyrir charts

**Eiginleikar**:
```typescript
interface JobTimeBreakdownItem {
  category: JobTimeCategory;      // Tegund tíma
  label: string;                  // Íslensku heiti
  hoursPerWeek: number;           // Klukkustundir á viku
  percentage: number;             // Prósenta af heildar tíma
}

type JobTimeCategory =
  | 'work'          // Grunnvinnustundir
  | 'overtime'      // Yfirvinna
  | 'prep'          // Undirbúningur
  | 'recovery'      // Endurhlaðning
  | 'commute';      // Ferðatími
```

**Staðfestingarreglur**: Engar (derived data)

**Útreikningar**:
```typescript
// Fyrir hvern category:
percentage = (hoursPerWeek / totalWeeklyHours) * 100
```

**Sambandleg gögn**: Afleidd úr `JobProfitTime`

**Geymslustefna**: Ekki vistað (computed on-the-fly)

---

### 7. JobProfitScenario

**Tilgangur**: Vistað atburðarás fyrir samanburð

**Eiginleikar**:
```typescript
interface JobProfitScenario {
  id: string;                     // Einstakt auðkenni
  name: string;                   // Nafn atburðarás (t.d. "Hlutastarf 75%")
  type: ScenarioType;             // Tegund atburðarás
  income: JobProfitIncome;        // Tekjur fyrir þessa atburðarás
  expenses: JobProfitExpense[];   // Útgjöld fyrir þessa atburðarás
  time: JobProfitTime;            // Tími fyrir þessa atburðarás
  results: JobProfitResults;      // Niðurstöður
  createdAt: string;              // ISO date string
}

type ScenarioType =
  | 'current'         // Núverandi staða
  | 'partTime75'      // Hlutastarf 75%
  | 'partTime50'      // Hlutastarf 50%
  | 'otherJob'        // Annað starf (custom)
  | 'selfEmployed';   // Sjálfstætt starfandi (custom)
```

**Staðfestingarreglur**:
- `id`: Sjálfvirkt generað
- `name`: Max 50 stafir
- `type`: Einn af skilgreindum tegundum
- Max 3 scenarios vistaðar í einu

**Sambandleg gögn**: Engin

**Geymslustefna**: Fylki í `jobProfitData.scenarios[]` í CalculatorContext

---

### 8. JobProfitData (Root container)

**Tilgangur**: Samansafn af öllum job profit gögnum

**Eiginleikar**:
```typescript
interface JobProfitData {
  income: JobProfitIncome;
  expenses: JobProfitExpense[];
  time: JobProfitTime;
  targetHourlyWage: number;       // Markmiðs tímakaup fyrir arðsemisútreikning
  scenarios: JobProfitScenario[];
}
```

**Staðfestingarreglur**:
- `targetHourlyWage`: >= 0, sjálfgefið 1500 ISK (lágmarkslaun)
- `scenarios`: Max 3 scenarios

**Sambandleg gögn**: Inniheldur öll önnur viðmót

**Geymslustefna**: Vistað í `CalculatorContext` sem hluti af `StoredState`

---

### Uppfærðir TypeScript types fyrir núverandi gagnalíkön

#### StoredState (uppfært)

```typescript
interface StoredState {
  version: number;                    // Bumpað í 2 fyrir job profit
  currentInputs: CalculatorInputs;    // Núverandi actual wage inputs
  scenarios: Scenario[];              // Actual wage scenarios
  subscriptions: Subscription[];      // Subscription data
  jobProfitData?: JobProfitData;      // Nýtt: Job profit data (optional fyrir migration)
  lastUpdated: string;
}
```

**Migration stefna**:
- Version 1 → 2: Bæta við `jobProfitData` með sjálfgefnum gildum
- `jobProfitData` er optional fyrir afturvirka samhæfni

---

### Sjálfgefin gildi (Default Values)

Í `src/lib/defaults.ts`:

```typescript
export const DEFAULT_JOB_PROFIT_INCOME: JobProfitIncome = {
  grossAnnualSalary: 0,
  annualBonuses: 0,
  benefitsValue: 0,
};

export const DEFAULT_JOB_PROFIT_TIME: JobProfitTime = {
  weeklyWorkHours: 40,
  weeklyUnpaidOvertime: 0,
  dailyPrepTimeMinutes: 0,
  dailyRecoveryTimeMinutes: 0,
  dailyCommuteTimeMinutes: 0,
};

export const DEFAULT_JOB_PROFIT_DATA: JobProfitData = {
  income: DEFAULT_JOB_PROFIT_INCOME,
  expenses: [],
  time: DEFAULT_JOB_PROFIT_TIME,
  targetHourlyWage: 1500, // Lágmarkslaun á Íslandi (ca.)
  scenarios: [],
};
```

---

### Flokkamerki (Category Labels)

Í `src/lib/calculations/jobProfit.ts`:

```typescript
export const JOB_EXPENSE_CATEGORY_LABELS: Record<JobExpenseCategory, string> = {
  clothing: 'Fatnaður',
  meals: 'Máltíðir',
  equipment: 'Búnaður',
  education: 'Menntun',
  membership: 'Aðild/Leyfi',
  other: 'Annað',
};

export const JOB_TIME_CATEGORY_LABELS: Record<JobTimeCategory, string> = {
  work: 'Grunnvinnustundir',
  overtime: 'Yfirvinna',
  prep: 'Undirbúningstími',
  recovery: 'Endurhlaðningartími',
  commute: 'Ferðatími',
};
```

---

### Forstilltar útgjöld (Expense Presets)

```typescript
export const JOB_EXPENSE_PRESETS: Omit<JobProfitExpense, 'id'>[] = [
  // Fatnaður
  { name: 'Vinnufatnaður og skór', annualCost: 50000, category: 'clothing' },
  { name: 'Hreinsun á vinnufatnaði', annualCost: 30000, category: 'clothing' },

  // Máltíðir
  { name: 'Hádegismatur úti (5 dagar/viku)', annualCost: 260000, category: 'meals' },
  { name: 'Kaffi og snarl', annualCost: 100000, category: 'meals' },

  // Búnaður
  { name: 'Tölva/tæki', annualCost: 80000, category: 'equipment' },
  { name: 'Verkfæri', annualCost: 50000, category: 'equipment' },

  // Menntun
  { name: 'Námskeið og símenntunar', annualCost: 100000, category: 'education' },
  { name: 'Bækur og efni', annualCost: 30000, category: 'education' },

  // Aðild/Leyfi
  { name: 'Fagfélag', annualCost: 40000, category: 'membership' },
  { name: 'Fagleyfi', annualCost: 60000, category: 'membership' },
];
```

## Útreikningaformúlur (Calculation Logic)

Allar útreikningsaðferðir skilgreindar í `src/lib/calculations/jobProfit.ts` sem pure functions.

### 1. calculateTotalIncome

**Tilgangur**: Reikna heildar árstekjur

**Formúla**:
```typescript
totalAnnualIncome = grossAnnualSalary + annualBonuses + benefitsValue
```

**Inntak**: `JobProfitIncome`
**Úttak**: `number` (ISK)

**Edge cases**:
- Ef allar tekjur eru 0, skilar 0
- Neikvæðar tölur ættu að vera stöðvaðar í validation lag

---

### 2. calculateTotalExpenses

**Tilgangur**: Reikna heildar ársútgjöld

**Formúla**:
```typescript
totalAnnualExpenses = sum(expenses.map(e => e.annualCost))
```

**Inntak**: `JobProfitExpense[]`
**Úttak**: `number` (ISK)

**Edge cases**:
- Ef expenses fylki er tómt, skilar 0
- Engar neikvæðar tölur leyfðar

---

### 3. calculateNetIncome

**Tilgangur**: Reikna nettó árstekjur eftir útgjöld

**Formúla**:
```typescript
netAnnualIncome = totalAnnualIncome - totalAnnualExpenses
```

**Inntak**: `totalIncome: number`, `totalExpenses: number`
**Úttak**: `number` (ISK, getur verið neikvætt ef tap)

**Edge cases**:
- Ef nettó er neikvætt, er starfið tap
- Þetta er mikilvægt signal fyrir notanda

---

### 4. calculateTotalWeeklyHours

**Tilgangur**: Reikna heildar vinnustundir á viku

**Formúla**:
```typescript
// Umbreyta daglegum mínútum í vikulegar klukkustundir
weeklyPrepHours = (dailyPrepTimeMinutes / 60) * 5
weeklyRecoveryHours = (dailyRecoveryTimeMinutes / 60) * 5
weeklyCommuteHours = (dailyCommuteTimeMinutes / 60) * 5

// Samtala
totalWeeklyHours = weeklyWorkHours +
                   weeklyUnpaidOvertime +
                   weeklyPrepHours +
                   weeklyRecoveryHours +
                   weeklyCommuteHours
```

**Inntak**: `JobProfitTime`
**Úttak**: `number` (klukkustundir)

**Edge cases**:
- Ef allt er 0, skilar 0 (en ætti ekki að vera mögulegur edge case)
- Margfaldað með 5 fyrir vinnudaga (ekki 7)

---

### 5. calculateNominalHourlyWage

**Tilgangur**: Reikna opinbert tímakaup (án útgjalda, eingöngu opinber tími)

**Formúla**:
```typescript
nominalHourlyWage = totalAnnualIncome / (weeklyWorkHours * 52)
```

**Inntak**: `totalIncome: number`, `weeklyWorkHours: number`
**Úttak**: `number` (ISK/klst)

**Edge cases**:
- Ef weeklyWorkHours er 0, skilar 0 (en validation ætti að koma í veg fyrir þetta)

---

### 6. calculateActualHourlyWage

**Tilgangur**: Reikna raunverulegt tímakaup (eftir útgjöld og allan tíma)

**Formúla**:
```typescript
totalAnnualHours = totalWeeklyHours * 52
actualHourlyWage = netAnnualIncome / totalAnnualHours
```

**Inntak**: `netIncome: number`, `totalWeeklyHours: number`
**Úttak**: `number` (ISK/klst, getur verið neikvætt)

**Edge cases**:
- Ef totalWeeklyHours er 0, skilar 0
- Getur verið neikvætt ef netAnnualIncome < 0
- Þetta er lykilútreikningur fyrir allan feature

---

### 7. calculateProfitabilityScore

**Tilgangur**: Reikna arðsemisstig sem prósenta af markmiðs tímakaup

**Formúla**:
```typescript
profitabilityScore = (actualHourlyWage / targetHourlyWage) * 100
```

**Inntak**: `actualHourlyWage: number`, `targetHourlyWage: number`
**Úttak**: `number` (prósenta)

**Edge cases**:
- Ef targetHourlyWage er 0, skilar 0
- Getur verið > 100% (mjög gott!)
- Getur verið neikvætt (mjög slæmt!)

---

### 8. determineProfitabilityLevel

**Tilgangur**: Ákvarða arðsemisflokkun út frá score

**Formúla**:
```typescript
function determineProfitabilityLevel(score: number): ProfitabilityLevel {
  if (score >= 125) return 'excellent';
  if (score >= 100) return 'good';
  if (score >= 75) return 'fair';
  if (score >= 50) return 'poor';
  return 'loss';
}
```

**Inntak**: `profitabilityScore: number`
**Úttak**: `ProfitabilityLevel`

**Litakóðun**:
- `excellent` (>= 125%): Djúpgrænn
- `good` (100-124%): Grænn
- `fair` (75-99%): Gulur
- `poor` (50-74%): Appelsínugulur
- `loss` (< 50%): Rauður

---

### 9. generateExpenseBreakdown

**Tilgangur**: Búa til sundurliðun útgjalda eftir flokkum

**Formúla**:
```typescript
function generateExpenseBreakdown(
  expenses: JobProfitExpense[],
  totalExpenses: number
): JobExpenseBreakdownItem[] {
  // Flokka útgjöld
  const byCategory = new Map<JobExpenseCategory, { amount: number; count: number }>();

  for (const expense of expenses) {
    const existing = byCategory.get(expense.category) || { amount: 0, count: 0 };
    byCategory.set(expense.category, {
      amount: existing.amount + expense.annualCost,
      count: existing.count + 1,
    });
  }

  // Umbreyta í array með prósentum
  const breakdown = Array.from(byCategory.entries()).map(([category, data]) => ({
    category,
    label: JOB_EXPENSE_CATEGORY_LABELS[category],
    amount: data.amount,
    percentage: totalExpenses > 0 ? (data.amount / totalExpenses) * 100 : 0,
    count: data.count,
  }));

  // Raða eftir upphæð (hæst fyrst)
  return breakdown.sort((a, b) => b.amount - a.amount);
}
```

**Inntak**: `expenses: JobProfitExpense[]`, `totalExpenses: number`
**Úttak**: `JobExpenseBreakdownItem[]`

---

### 10. generateTimeBreakdown

**Tilgangur**: Búa til sundurliðun tíma eftir tegundum

**Formúla**:
```typescript
function generateTimeBreakdown(
  time: JobProfitTime,
  totalWeeklyHours: number
): JobTimeBreakdownItem[] {
  const breakdown: JobTimeBreakdownItem[] = [
    {
      category: 'work',
      label: 'Grunnvinnustundir',
      hoursPerWeek: time.weeklyWorkHours,
      percentage: (time.weeklyWorkHours / totalWeeklyHours) * 100,
    },
    {
      category: 'overtime',
      label: 'Yfirvinna',
      hoursPerWeek: time.weeklyUnpaidOvertime,
      percentage: (time.weeklyUnpaidOvertime / totalWeeklyHours) * 100,
    },
    {
      category: 'prep',
      label: 'Undirbúningstími',
      hoursPerWeek: (time.dailyPrepTimeMinutes / 60) * 5,
      percentage: ((time.dailyPrepTimeMinutes / 60) * 5 / totalWeeklyHours) * 100,
    },
    {
      category: 'recovery',
      label: 'Endurhlaðningartími',
      hoursPerWeek: (time.dailyRecoveryTimeMinutes / 60) * 5,
      percentage: ((time.dailyRecoveryTimeMinutes / 60) * 5 / totalWeeklyHours) * 100,
    },
    {
      category: 'commute',
      label: 'Ferðatími',
      hoursPerWeek: (time.dailyCommuteTimeMinutes / 60) * 5,
      percentage: ((time.dailyCommuteTimeMinutes / 60) * 5 / totalWeeklyHours) * 100,
    },
  ];

  // Sía út 0 gildi
  return breakdown.filter(item => item.hoursPerWeek > 0);
}
```

**Inntak**: `time: JobProfitTime`, `totalWeeklyHours: number`
**Úttak**: `JobTimeBreakdownItem[]`

---

### 11. calculateJobProfitResults (Aðalútreikningur)

**Tilgangur**: Keyra alla útreikninga og skila fullum niðurstöðum

**Formúla**:
```typescript
function calculateJobProfitResults(
  income: JobProfitIncome,
  expenses: JobProfitExpense[],
  time: JobProfitTime,
  targetHourlyWage: number
): JobProfitResults {
  // Tekjur
  const totalAnnualIncome = calculateTotalIncome(income);

  // Útgjöld
  const totalAnnualExpenses = calculateTotalExpenses(expenses);

  // Nettó
  const netAnnualIncome = calculateNetIncome(totalAnnualIncome, totalAnnualExpenses);

  // Tími
  const totalWeeklyHours = calculateTotalWeeklyHours(time);
  const totalAnnualHours = totalWeeklyHours * 52;

  // Tímakaup
  const nominalHourlyWage = calculateNominalHourlyWage(
    totalAnnualIncome,
    time.weeklyWorkHours
  );
  const actualHourlyWage = calculateActualHourlyWage(netAnnualIncome, totalWeeklyHours);
  const hourlyWageReduction = nominalHourlyWage > 0
    ? ((nominalHourlyWage - actualHourlyWage) / nominalHourlyWage) * 100
    : 0;

  // Arðsemi
  const profitabilityScore = calculateProfitabilityScore(
    actualHourlyWage,
    targetHourlyWage
  );
  const profitabilityLevel = determineProfitabilityLevel(profitabilityScore);

  // Sundurliðun
  const expenseBreakdown = generateExpenseBreakdown(expenses, totalAnnualExpenses);
  const timeBreakdown = generateTimeBreakdown(time, totalWeeklyHours);

  return {
    totalAnnualIncome,
    totalAnnualExpenses,
    netAnnualIncome,
    totalWeeklyHours,
    totalAnnualHours,
    nominalHourlyWage,
    actualHourlyWage,
    hourlyWageReduction,
    profitabilityScore,
    profitabilityLevel,
    expenseBreakdown,
    timeBreakdown,
  };
}
```

**Inntak**: `income`, `expenses`, `time`, `targetHourlyWage`
**Úttak**: `JobProfitResults`

---

### 12. calculateScenario (Atburðarás útreikningar)

**Tilgangur**: Reikna niðurstöður fyrir ímyndaða atburðarás

**Formúlur**:

```typescript
function calculatePartTimeScenario(
  currentData: JobProfitData,
  percentage: number // 0.75 eða 0.50
): { income: JobProfitIncome; expenses: JobProfitExpense[]; time: JobProfitTime } {
  return {
    income: {
      grossAnnualSalary: currentData.income.grossAnnualSalary * percentage,
      annualBonuses: currentData.income.annualBonuses * percentage,
      benefitsValue: currentData.income.benefitsValue * percentage,
    },
    expenses: currentData.expenses.map(e => ({
      ...e,
      annualCost: e.annualCost * percentage, // Áætlað að útgjöld minnki hlutfallslega
    })),
    time: {
      weeklyWorkHours: currentData.time.weeklyWorkHours * percentage,
      weeklyUnpaidOvertime: currentData.time.weeklyUnpaidOvertime * percentage,
      dailyPrepTimeMinutes: currentData.time.dailyPrepTimeMinutes, // Sama
      dailyRecoveryTimeMinutes: currentData.time.dailyRecoveryTimeMinutes * percentage,
      dailyCommuteTimeMinutes: currentData.time.dailyCommuteTimeMinutes, // Sama
    },
  };
}
```

**Inntak**: `currentData: JobProfitData`, `percentage: number`
**Úttak**: Breytt data fyrir atburðarás

**Athugasemdir**:
- Undirbúningstími og ferðatími helst sá sami (þú þarft samt að klæða þig og fara í vinnu)
- Endurhlaðningartími gæti minnkað ef minna vinnuálag

---

### 13. generateRecommendations

**Tilgangur**: Greina gögn og búa til tillögur

**Reglur**:

```typescript
function generateRecommendations(
  results: JobProfitResults,
  expenses: JobProfitExpense[],
  time: JobProfitTime
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Regla 1: Hádegismáltíðir of háar
  const mealExpenses = results.expenseBreakdown.find(e => e.category === 'meals');
  if (mealExpenses && mealExpenses.percentage > 30) {
    recommendations.push({
      title: 'Taka mat að heiman',
      description: `Máltíðir eru ${mealExpenses.percentage.toFixed(0)}% af útgjöldum þínum.`,
      impact: mealExpenses.amount * 0.7, // Gætir sparað 70%
      priority: 'high',
    });
  }

  // Regla 2: Of mikil endurhlaðning
  if (time.dailyRecoveryTimeMinutes > 120) { // > 2 klst
    const recoveryHours = (time.dailyRecoveryTimeMinutes / 60) * 5;
    recommendations.push({
      title: 'Starf gæti verið of stressandi',
      description: `Þú þarft ${recoveryHours.toFixed(1)} klst/viku til að jafna þig.`,
      impact: 0, // Ekki beinn fjárhagslegur ávinningur, en mikilvægt
      priority: 'high',
    });
  }

  // Regla 3: Of mikil yfirvinna
  if (time.weeklyUnpaidOvertime > 10) {
    recommendations.push({
      title: 'Semja um hærri laun eða minna vinnuálag',
      description: `Þú vinnur ${time.weeklyUnpaidOvertime} klst/viku ótaldavinnu.`,
      impact: (time.weeklyUnpaidOvertime * 52) * results.nominalHourlyWage, // Hvað þetta ætti að kosta
      priority: 'high',
    });
  }

  // Regla 4: Of langur ferðatími
  if (time.dailyCommuteTimeMinutes > 60) { // > 1 klst
    const commuteHours = (time.dailyCommuteTimeMinutes / 60) * 5;
    recommendations.push({
      title: 'Leita að vinnu nær heimili eða fjarvinna',
      description: `Þú eyðir ${commuteHours.toFixed(1)} klst/viku í ferðalög.`,
      impact: commuteHours * 52 * results.actualHourlyWage, // Life energy sparnaður
      priority: 'medium',
    });
  }

  // Regla 5: Starfið er tap
  if (results.netAnnualIncome < 0) {
    recommendations.push({
      title: 'Finna annað starf',
      description: 'Starfið þitt er að kosta þig peninga. Þetta er tap.',
      impact: Math.abs(results.netAnnualIncome), // Hversu mikið tap
      priority: 'critical',
    });
  }

  // Raða eftir áhrifum (stærst fyrst)
  return recommendations.sort((a, b) => b.impact - a.impact);
}
```

**Inntak**: `results`, `expenses`, `time`
**Úttak**: `Recommendation[]`

---

### Prófanleg útreikningadæmi

**Dæmi 1: Grunnútreikningur**

Inntak:
```typescript
income = {
  grossAnnualSalary: 6000000,  // 6M ISK/ári
  annualBonuses: 0,
  benefitsValue: 0,
}

expenses = [
  { name: 'Hádegismatur', annualCost: 260000, category: 'meals' },
  { name: 'Vinnufatnaður', annualCost: 50000, category: 'clothing' },
]

time = {
  weeklyWorkHours: 40,
  weeklyUnpaidOvertime: 5,
  dailyPrepTimeMinutes: 30,    // 2.5 klst/viku
  dailyRecoveryTimeMinutes: 60, // 5 klst/viku
  dailyCommuteTimeMinutes: 60,  // 5 klst/viku
}

targetHourlyWage = 1500
```

Útreiknað:
```typescript
totalAnnualIncome = 6,000,000 ISK
totalAnnualExpenses = 310,000 ISK
netAnnualIncome = 5,690,000 ISK

totalWeeklyHours = 40 + 5 + 2.5 + 5 + 5 = 57.5 klst
totalAnnualHours = 57.5 * 52 = 2,990 klst

nominalHourlyWage = 6,000,000 / (40 * 52) = 2,885 ISK/klst
actualHourlyWage = 5,690,000 / 2,990 = 1,903 ISK/klst
hourlyWageReduction = ((2,885 - 1,903) / 2,885) * 100 = 34%

profitabilityScore = (1,903 / 1,500) * 100 = 127%
profitabilityLevel = 'excellent'
```

**Niðurstaða**: Starfið er arðbært en þú ert að tapa 34% af tímakaup þínu vegna kostnaðar og auka tíma.

---

## Villustjórnun (Error Handling)

### Flokkar villna

#### 1. Staðfestingarvillur (Validation Errors)

**Lýsing**: Inntak sem uppfyllir ekki staðfestingarreglur

**Dæmi**:
- Brúttó árslaun < 0
- Nafn útgjalds tómt
- Vinnustundir > 100 klst/viku

**Viðbrögð**:
- Sýna villuboð við innsláttarreit (rauður rammi + textilegu boð)
- Hindra vista þangað til villa er lagfærð
- Ekki senda ógild gögn til útreikninga

**Villuboð (íslenska)**:
```typescript
const VALIDATION_MESSAGES = {
  income: {
    salaryRequired: 'Laun verða að vera hærri en 0 kr',
    salaryTooHigh: 'Laun eru óeðlilega há (> 100M kr)',
    bonusNegative: 'Bónusar geta ekki verið neikvæðir',
  },
  expense: {
    nameRequired: 'Nafn má ekki vera tómt',
    nameMaxLength: 'Nafn má ekki vera lengra en 100 stafir',
    costRequired: 'Kostnaður verður að vera hærri en 0 kr',
    costTooHigh: 'Kostnaður er óeðlilega hár (> 5M kr)',
  },
  time: {
    hoursRequired: 'Vinnustundir verða að vera hærri en 0',
    hoursTooHigh: 'Vinnustundir eru óeðlilega háar (> 100 klst/viku)',
    minutesNegative: 'Mínútur geta ekki verið neikvæðar',
    minutesTooHigh: 'Tími er óeðlilega langur',
  },
};
```

**Kóðadæmi**:
```typescript
function validateJobProfitIncome(income: JobProfitIncome): Record<string, string> {
  const errors: Record<string, string> = {};

  if (income.grossAnnualSalary <= 0) {
    errors.grossAnnualSalary = VALIDATION_MESSAGES.income.salaryRequired;
  }
  if (income.grossAnnualSalary > 100_000_000) {
    errors.grossAnnualSalary = VALIDATION_MESSAGES.income.salaryTooHigh;
  }
  if (income.annualBonuses < 0) {
    errors.annualBonuses = VALIDATION_MESSAGES.income.bonusNegative;
  }

  return errors;
}
```

---

#### 2. Útreikningavillur (Calculation Errors)

**Lýsing**: Villur sem koma upp við útreikninga (t.d. deiling með núll)

**Dæmi**:
- Deiling með 0 ef vinnustundir eru 0
- Óvænt NaN gildi

**Viðbrögð**:
- Athuga edge cases í öllum útreikningum
- Skila 0 ef ógildar aðstæður
- Logga console warning fyrir debugging

**Kóðadæmi**:
```typescript
function calculateActualHourlyWage(netIncome: number, totalWeeklyHours: number): number {
  if (totalWeeklyHours === 0) {
    console.warn('Cannot calculate hourly wage: totalWeeklyHours is 0');
    return 0;
  }

  const totalAnnualHours = totalWeeklyHours * 52;
  return netIncome / totalAnnualHours;
}
```

---

#### 3. Gagnaeymsluvillur (Storage Errors)

**Lýsing**: Villur við lestur eða skrif í localStorage

**Dæmi**:
- localStorage er fullt
- localStorage er ekki aðgengilegt (disabled)
- JSON parse villa

**Viðbrögð**:
- Nota `safeGetItem` og `safeSetItem` wrappers
- Birta notanda viðvörun ef vista tekst ekki
- Halda stöðu í minni þó localStorage virki ekki

**Kóðadæmi**:
```typescript
function safeSetJobProfitData(data: JobProfitData): boolean {
  try {
    localStorage.setItem('jobProfitData', JSON.stringify(data));
    return true;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      alert('Ekki nægt pláss í geymslu. Vinsamlegast eyðið gömlum gögnum.');
    } else {
      console.error('Failed to save data:', error);
      alert('Gat ekki vistað gögn. Prófaðu aftur.');
    }
    return false;
  }
}
```

---

#### 4. Innflutningavillur (Import Errors)

**Lýsing**: Villur við innflutning á gögnum frá JSON skrá

**Dæmi**:
- Skrá er ekki JSON
- JSON hefur rangt snið
- Útgáfa er ósamhæf

**Viðbrögð**:
- Staðfesta JSON snið áður en import
- Sýna skýrt villuboð
- Hafna import ef gögn eru ógild

**Kóðadæmi**:
```typescript
async function importJobProfitData(file: File): Promise<void> {
  try {
    const text = await file.text();
    const data = JSON.parse(text) as StoredState;

    // Validation
    if (!data.version || !data.jobProfitData) {
      throw new Error('Ógild skrá. Skráin virðist ekki vera rétt snið.');
    }

    if (data.version !== STORAGE_VERSION) {
      throw new Error(
        `Ósamhæf útgáfa. Skráin er útgáfa ${data.version}, en app styður útgáfu ${STORAGE_VERSION}.`
      );
    }

    // Load data
    setJobProfitData(data.jobProfitData);
  } catch (error) {
    if (error instanceof SyntaxError) {
      alert('Gat ekki lesið skrá. Skráin er ekki gild JSON skrá.');
    } else if (error instanceof Error) {
      alert(error.message);
    } else {
      alert('Óþekkt villa við innflutning');
    }
  }
}
```

---

#### 5. Netfalsvillur (Network Errors)

**Lýsing**: Ekki við (engar netbeiðnir í þessum feature)

**Viðbrögð**: N/A - Allir útreikningar eru client-side

---

### Villustjórnunarstefna fyrir hvert lag

#### UI Lag (Components)

**Ábyrgð**:
- Staðfesta inntak real-time
- Sýna villuboð við inntak reiti
- Hindra submit ef villur eru til staðar
- Sýna loading states (ef við á)

**Dæmi**:
```tsx
<Input
  label="Brúttó árslaun"
  value={salary}
  onChange={(e) => setSalary(e.target.value)}
  error={errors.salary}  // Sýnir villuboð
  required
/>
```

---

#### Reiknilög (Calculations)

**Ábyrgð**:
- Athuga edge cases (deiling með 0, negative gildi)
- Skila öruggum gildum (aldrei NaN eða undefined)
- Logga warnings fyrir debugging

**Dæmi**:
```typescript
export function calculateProfitabilityScore(
  actualWage: number,
  targetWage: number
): number {
  if (targetWage === 0 || isNaN(targetWage)) {
    console.warn('Target wage is 0 or NaN, returning 0');
    return 0;
  }
  return (actualWage / targetWage) * 100;
}
```

---

#### Stöðustjórnunarlög (Context)

**Ábyrgð**:
- Try-catch around storage operations
- Graceful degradation ef localStorage virkar ekki
- Migration logic fyrir útgáfuuppfærslur

**Dæmi**:
```typescript
useEffect(() => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored) as StoredState;
      if (data.version === STORAGE_VERSION) {
        setJobProfitData(data.jobProfitData);
      } else {
        // Migration logic
        migrateData(data);
      }
    }
  } catch (error) {
    console.error('Failed to load data from storage:', error);
    // Continue with default values
  }
}, []);
```

---

### Notendavæn villuboð

Öll villuboð á íslensku og skýr:

| Villugerð | Tæknilegt boð | Notendaboð |
|-----------|--------------|------------|
| Validation | `grossAnnualSalary must be > 0` | `Laun verða að vera hærri en 0 kr` |
| Storage full | `QuotaExceededError` | `Ekki nægt pláss í geymslu. Vinsamlegast eyðið gömlum gögnum.` |
| Import fail | `JSON.parse error` | `Gat ekki lesið skrá. Skráin er ekki gild JSON skrá.` |
| Calculation | `Division by zero` | `Ekki hægt að reikna. Vinsamlegast athugið inntak.` |

---

### Aðgengi (Accessibility) villustjórnun

**WCAG 2.1 AA compliance**:
- Villuboð tengd við form fields með `aria-describedby`
- Villuboð sýnd með auðlesanlegum lit (contrast ratio >= 4.5:1)
- Screen readers tilkynna villur
- Focus á fyrsta villusvæði þegar validation fails

**Kóðadæmi**:
```tsx
<Input
  id="salary"
  label="Brúttó árslaun"
  value={salary}
  onChange={handleChange}
  error={errors.salary}
  aria-describedby={errors.salary ? 'salary-error' : undefined}
  aria-invalid={!!errors.salary}
/>
{errors.salary && (
  <span id="salary-error" className="text-error" role="alert">
    {errors.salary}
  </span>
)}
```

---

## Prófunarstefna (Testing Strategy)

### Prófstig (Testing Levels)

#### 1. Unit Testing (Einingaprófanir)

**Markmið**: Prófa einstakar aðferðir og pure functions

**Tól**: Vitest

**Umfang**:
- Allar útreikningsaðferðir í `src/lib/calculations/jobProfit.ts`
- Staðfestingaraðferðir í validators
- Helper functions

**Dæmi**:

```typescript
// src/lib/calculations/__tests__/jobProfit.test.ts

import { describe, it, expect } from 'vitest';
import {
  calculateTotalIncome,
  calculateActualHourlyWage,
  determineProfitabilityLevel,
} from '../jobProfit';

describe('calculateTotalIncome', () => {
  it('should sum all income sources', () => {
    const income = {
      grossAnnualSalary: 6000000,
      annualBonuses: 500000,
      benefitsValue: 200000,
    };
    expect(calculateTotalIncome(income)).toBe(6700000);
  });

  it('should return 0 if all incomes are 0', () => {
    const income = {
      grossAnnualSalary: 0,
      annualBonuses: 0,
      benefitsValue: 0,
    };
    expect(calculateTotalIncome(income)).toBe(0);
  });
});

describe('calculateActualHourlyWage', () => {
  it('should calculate correct hourly wage', () => {
    const netIncome = 5690000;
    const weeklyHours = 57.5;
    const expected = 5690000 / (57.5 * 52);
    expect(calculateActualHourlyWage(netIncome, weeklyHours)).toBeCloseTo(expected, 2);
  });

  it('should return 0 if weekly hours is 0', () => {
    expect(calculateActualHourlyWage(6000000, 0)).toBe(0);
  });

  it('should handle negative net income (job loss)', () => {
    const netIncome = -100000;
    const weeklyHours = 40;
    const result = calculateActualHourlyWage(netIncome, weeklyHours);
    expect(result).toBeLessThan(0);
  });
});

describe('determineProfitabilityLevel', () => {
  it('should return "excellent" for score >= 125', () => {
    expect(determineProfitabilityLevel(130)).toBe('excellent');
  });

  it('should return "good" for score 100-124', () => {
    expect(determineProfitabilityLevel(110)).toBe('good');
  });

  it('should return "fair" for score 75-99', () => {
    expect(determineProfitabilityLevel(85)).toBe('fair');
  });

  it('should return "poor" for score 50-74', () => {
    expect(determineProfitabilityLevel(60)).toBe('poor');
  });

  it('should return "loss" for score < 50', () => {
    expect(determineProfitabilityLevel(30)).toBe('loss');
  });
});
```

**Þekjumarkmið**: >= 90% line coverage fyrir calculations

---

#### 2. Integration Testing (Samþættingarprófanir)

**Markmið**: Prófa samskipti milli laga (components + context + calculations)

**Tól**: Vitest + React Testing Library

**Umfang**:
- Context integration með calculations
- Component integration með context
- LocalStorage integration

**Dæmi**:

```typescript
// tests/integration/jobProfit.test.tsx

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CalculatorProvider } from '@/context/CalculatorContext';
import { JobProfitDashboard } from '@/components/jobProfit/JobProfitDashboard';

describe('Job Profit Feature Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should calculate profitability when user enters data', async () => {
    render(
      <CalculatorProvider>
        <JobProfitDashboard />
      </CalculatorProvider>
    );

    // Enter income
    const salaryInput = screen.getByLabelText(/brúttó árslaun/i);
    fireEvent.change(salaryInput, { target: { value: '6000000' } });

    // Enter hours
    const hoursInput = screen.getByLabelText(/vinnustundir/i);
    fireEvent.change(hoursInput, { target: { value: '40' } });

    // Check that results are displayed
    const actualWage = await screen.findByText(/raunverulegt tímakaup/i);
    expect(actualWage).toBeInTheDocument();
  });

  it('should persist data to localStorage', async () => {
    const { rerender } = render(
      <CalculatorProvider>
        <JobProfitDashboard />
      </CalculatorProvider>
    );

    // Enter data
    const salaryInput = screen.getByLabelText(/brúttó árslaun/i);
    fireEvent.change(salaryInput, { target: { value: '6000000' } });

    // Wait for debounce
    await new Promise(resolve => setTimeout(resolve, 600));

    // Check localStorage
    const stored = localStorage.getItem('actual-hourly-wage-calculator');
    expect(stored).toBeTruthy();
    const data = JSON.parse(stored!);
    expect(data.jobProfitData.income.grossAnnualSalary).toBe(6000000);
  });
});
```

---

#### 3. Component Testing (Íhlutatests)

**Markmið**: Prófa einstakar UI íhlutir

**Tól**: React Testing Library + Vitest

**Umfang**:
- Allar job profit íhlutir
- User interactions (click, type, submit)
- Error states
- Loading states

**Dæmi**:

```typescript
// tests/components/jobProfit/JobProfitIncomeForm.test.tsx

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { JobProfitIncomeForm } from '@/components/jobProfit/JobProfitIncomeForm';

describe('JobProfitIncomeForm', () => {
  it('should render all input fields', () => {
    render(
      <JobProfitIncomeForm
        income={{ grossAnnualSalary: 0, annualBonuses: 0, benefitsValue: 0 }}
        onChange={() => {}}
      />
    );

    expect(screen.getByLabelText(/brúttó árslaun/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/bónusar/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/fríðindi/i)).toBeInTheDocument();
  });

  it('should call onChange when user types', () => {
    const handleChange = vi.fn();
    render(
      <JobProfitIncomeForm
        income={{ grossAnnualSalary: 0, annualBonuses: 0, benefitsValue: 0 }}
        onChange={handleChange}
      />
    );

    const salaryInput = screen.getByLabelText(/brúttó árslaun/i);
    fireEvent.change(salaryInput, { target: { value: '6000000' } });

    expect(handleChange).toHaveBeenCalledWith({ grossAnnualSalary: 6000000 });
  });

  it('should display error for invalid input', () => {
    render(
      <JobProfitIncomeForm
        income={{ grossAnnualSalary: -1000, annualBonuses: 0, benefitsValue: 0 }}
        errors={{ grossAnnualSalary: 'Laun verða að vera hærri en 0 kr' }}
        onChange={() => {}}
      />
    );

    expect(screen.getByText(/laun verða að vera hærri en 0 kr/i)).toBeInTheDocument();
  });

  it('should be accessible (WCAG)', () => {
    const { container } = render(
      <JobProfitIncomeForm
        income={{ grossAnnualSalary: 0, annualBonuses: 0, benefitsValue: 0 }}
        onChange={() => {}}
      />
    );

    // All inputs should have labels
    const inputs = container.querySelectorAll('input');
    inputs.forEach(input => {
      const label = container.querySelector(`label[for="${input.id}"]`);
      expect(label).toBeInTheDocument();
    });
  });
});
```

---

#### 4. End-to-End Testing (Enda-til-enda)

**Markmið**: Prófa heilar notendaflæði

**Tól**: Playwright (ef þegar til staðar) eða manual testing

**Umfang**:
- Fylgja User Stories NS-1 til NS-8
- Prófa critical paths

**Lykilflæði til að prófa**:

1. **Nýr notandi slær inn fyrstu gögn**
   - Sláðu inn tekjur → Sjáðu niðurstöður
   - Bæta við útgjaldi → Sjáðu uppfærðar niðurstöður
   - Sláðu inn tíma → Sjáðu uppfærðar niðurstöður

2. **Notandi býr til atburðarás**
   - Veldu "Hlutastarf 75%" → Sjáðu samanburð
   - Vista atburðarás → Hún birtist í lista
   - Eyða atburðarás → Hún hverfur

3. **Notandi exportar og importar**
   - Export gögn til JSON
   - Hreinsa allt
   - Import frá JSON → Gögn endurheimtast

4. **Villustjórnun**
   - Sláðu inn ógild gögn → Sjáðu villuboð
   - Hætta við form → Engar breytingar vistaðar
   - Full localStorage → Sjáðu viðvörun

---

### Prófunarstefna fyrir non-functional requirements

#### Afköst (Performance)

**Krafa**: Útreikningar uppfærast innan 50ms

**Próf**:
```typescript
it('should calculate results within 50ms', () => {
  const startTime = performance.now();
  const results = calculateJobProfitResults(income, expenses, time, targetWage);
  const endTime = performance.now();

  expect(endTime - startTime).toBeLessThan(50);
});
```

---

#### Aðgengi (Accessibility)

**Krafa**: WCAG 2.1 AA compliance

**Próf**:
- Manual testing með screen reader (VoiceOver á Mac)
- Keyboard navigation testing
- Color contrast validation (með Contrast Checker tól)
- Automated testing með axe-core:

```typescript
import { axe } from 'jest-axe';

it('should have no accessibility violations', async () => {
  const { container } = render(<JobProfitDashboard />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

#### Persónuvernd (Privacy)

**Krafa**: Engin gögn send á server

**Próf**:
- Network monitoring: Engar HTTP requests þegar feature er notað
- Validation að öll gögn séu í localStorage

---

### Þekja (Coverage)

**Markmið**:
- **Unit tests**: >= 90% line coverage fyrir calculations
- **Component tests**: >= 80% line coverage fyrir UI components
- **Integration tests**: Öll critical paths covered

**Tól**: Vitest coverage reporter

**Keyra coverage**:
```bash
npm run test:coverage
```

---

### Continuous Integration

**Stefna**:
- Öll tests keyrd á hverjum commit
- Tests verða að passa áður en merge í main
- Coverage reports birt í PR comments

**GitHub Actions dæmi**:
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:coverage
      - run: npm run test:accessibility
```

## Hönnunarákvarðanir (Design Decisions)

Hönnunarákvarðanir eru skráðar í viðeigandi kafla. Sjá:
- **Arkitektúr ákvörðun**: Kafli "Byggingarkerfi" → "Hönnunarákvarðanir - Arkitektúr"

## Rekjanleiki til krafna (Requirements Traceability)

Þessi kafli sýnir hvernig hönnun hönnin til uppfylla allar kröfur úr requirements skjalinu.

### NS-1: Skrá tekjur starfs

**Hönnunarþættir**:
- **Gagnalíkan**: `JobProfitIncome` með `grossAnnualSalary`, `annualBonuses`, `benefitsValue`
- **Íhlutur**: `JobProfitIncomeForm` fyrir innsláttar
- **Staðfesting**: Validation fyrir > 0 á launum, >= 0 á öðru
- **Geymsla**: Vista í `jobProfitData.income` í CalculatorContext
- **Útreikning**: `calculateTotalIncome()` reiknar heildar árstekjur
- **Prófanir**: Unit tests fyrir `JobProfitIncomeForm`, validation tests

**Samþykktarviðmið**:
- ✓ 1: Form sýnir alla reiti (brúttó, bónusar, fríðindi)
- ✓ 2: Vista uppfærir útreikninga
- ✓ 3: Vistað í localStorage
- ✓ 4: Real-time uppfærslur með React state
- ✓ 5: Validation hindrar 0 eða neikvæð gildi

---

### NS-2: Skrá vinnuvið tengd útgjöld

**Hönnunarþættir**:
- **Gagnalíkan**: `JobProfitExpense` með nafn, kostnað, flokk
- **Íhlutur**: `JobProfitExpenseList` birtir lista, `JobProfitExpenseForm` fyrir add/edit
- **Flokkar**: 6 flokkar (clothing, meals, equipment, education, membership, other)
- **Forstillt útgjöld**: `JOB_EXPENSE_PRESETS` með íslenskum dæmum
- **Context aðferðir**: `addJobExpense()`, `updateJobExpense()`, `deleteJobExpense()`
- **Prófanir**: Component tests fyrir list og form

**Samþykktarviðmið**:
- ✓ 1: Form með nafn, kostnað, flokk
- ✓ 2: Forstillt flýtival með algengum útgjöldum
- ✓ 3: Forstillt gildi fylla form sjálfkrafa
- ✓ 4: Notandi getur breytt forstilltum gildum
- ✓ 5: Vista bætir við lista og uppfærir útreikninga
- ✓ 6: Eyða fjarlægir úr lista
- ✓ 7: Sýnir samtölu eftir flokkum með `generateExpenseBreakdown()`

---

### NS-3: Skrá tímakostnað starfs

**Hönnunarþættir**:
- **Gagnalíkan**: `JobProfitTime` með vinnustundir, yfirvinna, undirbúning, endurhlaðning, ferðatími
- **Íhlutur**: `JobProfitTimeForm`
- **Umbreyting**: Dagleg mínútur → vikulegar klukkustundir (* 5 vinnudagar)
- **Útreikning**: `calculateTotalWeeklyHours()` reiknar heildar tíma
- **Birting**: Samanburður á "opinber vs raunverulegur" tími
- **Prófanir**: Unit tests fyrir time calculations

**Samþykktarviðmið**:
- ✓ 1: Form með öllum tímareitum
- ✓ 2: Útreikningur: `totalWeeklyHours = workHours + overtime + (prep/60)*5 + (recovery/60)*5 + (commute/60)*5`
- ✓ 3: Real-time uppfærslur
- ✓ 4: Validation hindrar neikvæðar tölur
- ✓ 5: Sýnir samanburð milli opinbers og raunverulegs tíma

---

### NS-4: Sjá raunverulegt tímakaup eftir kostnað

**Hönnunarþættir**:
- **Útreikningur**: `calculateActualHourlyWage()` með formúlu úr requirements
- **Birting**: `JobProfitabilityDisplay` sýnir allar lykiltölur
- **Samanburður**: Raunverulegt vs opinbert tímakaup
- **Viðvörun**: Sérstök birting ef tímakaup er neikvætt (tap)
- **Prófanir**: Unit tests með dæmum úr requirements

**Samþykktarviðmið**:
- ✓ 1: Formúlur:
  - `netAnnualIncome = totalIncome - totalExpenses`
  - `actualHourlyWage = netIncome / (totalWeeklyHours * 52)`
- ✓ 2: Sýnir raunverulegt, opinbert, og mismun (kr og %)
- ✓ 3: Viðvörun ef neikvætt
- ✓ 4: Real-time uppfærslur

---

### NS-5: Sjá arðsemisstig starfs

**Hönnunarþættir**:
- **Útreikningur**: `calculateProfitabilityScore()` og `determineProfitabilityLevel()`
- **Litakóðun**: 5 stig (excellent, good, fair, poor, loss)
- **Markmiðs tímakaup**: `targetHourlyWage` í `JobProfitData`, sjálfgefið 1500 ISK
- **Birting**: `JobProfitabilityDisplay` með litakóðuðum badge
- **Prófanir**: Unit tests fyrir level determination

**Samþykktarviðmið**:
- ✓ 1: Formúla: `score = (actualHourlyWage / targetHourlyWage) * 100`
- ✓ 2: Litakóðun:
  - Grænt (excellent): >= 125%
  - Grænt (good): 100-124%
  - Gult (fair): 75-99%
  - Appelsínugult (poor): 50-74%
  - Rautt (loss): < 50%
- ✓ 3: Notandi getur sett markmiðs tímakaup
- ✓ 4: Sjálfgefið 1500 ISK (lágmarkslaun)
- ✓ 5: Textilegar lýsingar (t.d. "Starfið þitt er arðbært!")

---

### NS-6: Sjá sundurliðun kostnaðar og tíma

**Hönnunarþættir**:
- **Útreikningar**: `generateExpenseBreakdown()` og `generateTimeBreakdown()`
- **Birting**: `JobProfitBreakdownCharts` með bar charts
- **Röðun**: Raðað eftir stærð (stærst fyrst)
- **Snið**: Bæði krónutölur/klukkustundir og prósentur
- **Prófanir**: Unit tests fyrir breakdown functions

**Samþykktarviðmið**:
- ✓ 1: Útgjaldaskil eftir flokkum með kr og %
- ✓ 2: Tímaskil eftir tegundum með klst og %
- ✓ 3: Raðað eftir stærð
- ✓ 4: Bæði krónutölur og prósentur

---

### NS-7: Bera saman atburðarás

**Hönnunarþættir**:
- **Gagnalíkan**: `JobProfitScenario` með 5 tegundum
- **Útreikningar**: `calculatePartTimeScenario()` fyrir hlutastarf
- **Íhlutur**: `JobProfitScenarioComparison` með hlið-við-hlið samanburði
- **Context**: `addJobScenario()`, `deleteJobScenario()` aðferðir
- **Prófanir**: Integration tests fyrir scenario comparison

**Samþykktarviðmið**:
- ✓ 1: 5 atburðarás tegundir:
  - Núverandi staða
  - Hlutastarf 75%
  - Hlutastarf 50%
  - Annað starf (custom)
  - Sjálfstætt starfandi (custom)
- ✓ 2: Reiknar nýtt raunverulegt tímakaup fyrir atburðarás
- ✓ 3: Hlið við hlið samanburður með tekjum, útgjöldum, tíma, tímakaup
- ✓ 4: Vista atburðarás
- ✓ 5: Vistað í localStorage

---

### NS-8: Sjá tillögur til að bæta arðsemi

**Hönnunarþættir**:
- **Útreikningur**: `generateRecommendations()` með reglum úr requirements
- **Íhlutur**: `JobProfitRecommendations` birtir tillögur
- **Raðun**: Raðað eftir fjárhagslegum áhrifum (impact)
- **Reglur**: 5 aðal reglur (sjá NS-8 í requirements)
- **Prófanir**: Unit tests fyrir recommendation logic

**Samþykktarviðmið**:
- ✓ 1-5: Allar 5 reglur útfærðar:
  - Hádegismáltíðir > 30% → "Taka mat að heiman"
  - Endurhlaðning > 2 klst → "Of stressandi"
  - Yfirvinna > 10 klst → "Semja um hærri laun"
  - Ferðatími > 1 klst → "Vinna nær heimili"
  - Neikvætt tímakaup → "Finna annað starf"
- ✓ 6: Raðað eftir áhrifum

---

### Kröfur sem ekki tengjast virkni (Non-functional requirements)

#### Afköst

**Krafa**: Útreikningar innan 50ms

**Hönnun**:
- Allar reikningsaðferðir eru pure functions (fljótar)
- Engar async operations í útreikningum
- Debounced localStorage saves (500ms)
- **Prófun**: Performance tests í unit tests

---

#### Aðgengi

**Krafa**: WCAG 2.1 AA

**Hönnun**:
- Allir inputs með labels
- Aria attributes fyrir villur
- Keyboard navigation support (Tab, Enter, Esc)
- Screen reader support með semantic HTML
- Color contrast >= 4.5:1
- **Prófun**: Axe-core automated tests, manual screen reader testing

---

#### Persónuvernd

**Krafa**: Eingöngu client-side, localStorage, engir netþjónar

**Hönnun**:
- Allir útreikningar client-side (pure functions)
- Geymsla í localStorage með `safeGetItem/safeSetItem`
- Export/import með JSON files
- **Prófun**: Network monitoring tests (engar HTTP requests)

---

#### Notendaviðmót

**Krafa**: Íslenska, responsive, sama design system

**Hönnun**:
- Allur texti á íslensku (labels, validation messages, etc.)
- Notar núverandi UI components (Input, Select, Button, Card)
- Responsive með Tailwind breakpoints
- Íslenskt talnasnið (1.234.567,89 kr)
- **Prófun**: Responsive tests, UI component tests

---

#### Gagnageymsla

**Krafa**: localStorage með lykli `jobProfitLoss`

**Hönnun**:
- Geymt í núverandi `actual-hourly-wage-calculator` lykli
- `jobProfitData` bætt við StoredState
- Version bump til 2 fyrir migration
- Auto-save með 500ms debounce
- Export/import með sama mynstri
- **Prófun**: Storage integration tests

---

### Samantekt - Kröfuþekja

| Krafa | Hönnun | Staða |
|-------|--------|-------|
| NS-1 | JobProfitIncome + JobProfitIncomeForm | ✓ Uppfyllt |
| NS-2 | JobProfitExpense + JobProfitExpenseList/Form | ✓ Uppfyllt |
| NS-3 | JobProfitTime + JobProfitTimeForm | ✓ Uppfyllt |
| NS-4 | calculateActualHourlyWage + JobProfitabilityDisplay | ✓ Uppfyllt |
| NS-5 | calculateProfitabilityScore + litakóðun | ✓ Uppfyllt |
| NS-6 | generateBreakdown + JobProfitBreakdownCharts | ✓ Uppfyllt |
| NS-7 | JobProfitScenario + JobProfitScenarioComparison | ✓ Uppfyllt |
| NS-8 | generateRecommendations + JobProfitRecommendations | ✓ Uppfyllt |
| Afköst | Pure functions, < 50ms | ✓ Uppfyllt |
| Aðgengi | WCAG 2.1 AA, aria, keyboard | ✓ Uppfyllt |
| Persónuvernd | Client-side, localStorage | ✓ Uppfyllt |
| UI | Íslenska, responsive, same design | ✓ Uppfyllt |
| Geymsla | localStorage + export/import | ✓ Uppfyllt |

**Niðurstaða**: Hönnunin uppfyllir allar kröfur úr requirements skjalinu.
