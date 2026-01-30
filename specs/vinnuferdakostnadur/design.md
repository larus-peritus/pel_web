# Design Document: Vinnuferðakostnaðarreiknivél (Commute Cost Calculator)

## Yfirlit

Vinnuferðakostnaðarreiknivélin er nýr eiginleiki sem bætist við peninganaedalifid.is forritið. Hún hjálpar notendum að skilja raunverulegan kostnað vinnuferða - ekki bara bensínkostnað, heldur líka tíma, óbeinan bílakostnað, og áhrif á fjárhagslegt frelsi (FI).

### Helstu þættir hönnunar

**Arkitektúr**:
- Client-side React forrit með TypeScript
- Samþættist við núverandi CalculatorContext fyrir state management
- Fylgir sömu patterns og Subscription Burn Meter (sannað pattern)
- Allt að 4 samanburðarsviðsmyndir studdar
- localStorage fyrir gagnaþráðleika

**Íhlutir**:
- **CommuteCalculator**: Aðal container sem stjórnar sviðsmyndum
- **CommuteForm**: Dynamic form með conditional fields miðað við ferðamáta
- **CommuteSummary**: Ítarlegar niðurstöður fyrir eina sviðsmynd
- **CommuteComparison**: Side-by-side samanburður á 2-4 sviðsmyndum
- **CommutePresetSelector**: Flýtival fyrir algengar íslenskar vinnuferðir

**Gagnalíkön**:
- **CommuteScenario**: Aðal scenario entity með inputs og results
- **CommuteInputs**: Conditional structure miðað við ferðamáta (car, transit, bike, walk, remote)
- **CommuteResults**: Comprehensive results með kostnaði, tíma, lífsorku, og FI áhrifum
- Sérhæfðir detail types: CarCommuteDetails, TransitCommuteDetails, ActiveCommuteDetails

**Útreikningar**:
- Peningalegur kostnaður (beinn + óbeinn fyrir bíla)
- Tími í vinnuferð (mínútur/klukkustundir/dagar)
- Lífsorku kostnaður (tími + peningar sem lífsorka)
- Framtíðarvirði ef fjárfest við 7% ávöxtun (5, 10, 20 ár)
- Sundurliðun á kostnaðarþáttum

**Notendaupplifun**:
- Preset selector fyrir algengar íslenskar vinnuferðir
- Real-time validation með Icelandic error messages
- Responsive design (desktop, tablet, mobile)
- Impactful messaging um lífsorku tap
- Color-coded comparison (grænt=best, rautt=worst)

**Villustýring**:
- Comprehensive validation á öllum inputs
- Graceful handling ef actualHourlyWage vantar
- localStorage failure fallback
- Edge case handling (division by zero, mjög há gildi)
- WCAG 2.1 AA accessible error messages

**Prófun**:
- 100% unit test coverage fyrir calculations
- 80%+ component test coverage
- Integration tests fyrir CalculatorContext
- E2E tests fyrir critical user flows
- Accessibility testing (axe-core + manual)
- Performance testing (< 50ms calculations)

### Lykilákvarðanir

1. **Samþæting við CalculatorContext**: Fylgir subscription pattern, deilir actualHourlyWage auðveldlega
2. **Hámark 4 sviðsmyndir**: Nægilegt fyrir algengar use-cases, viðráðanlegt UI
3. **Accordion form pattern**: Skýrt workflow, auðveldur samanburður
4. **Conditional form fields**: Sýnir bara viðeigandi fields miðað við ferðamáta
5. **Preset support**: Sparar tíma með raunhæfum gildum fyrir algengar íslenskar vinnuferðir

### Tækniþáttur

- **Frontend**: React 18+ með TypeScript
- **State**: React Context API (CalculatorContext)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Validation**: Custom functions með Icelandic messages
- **Testing**: Vitest + React Testing Library
- **Storage**: localStorage (client-side only)

### Næstu skref

1. Innleiða TypeScript types í `/types/calculator.ts`
2. Búa til calculation functions í `/lib/calculations/commute.ts`
3. Útfæra validation í `/lib/validation/commute.ts`
4. Bæta við CalculatorContext extensions
5. Byggja React components í `/components/commute/`
6. Skrifa unit tests
7. Skrifa component tests
8. Manual testing á responsive design og accessibility

## Arkitektúr

### Kerfisyfirlit (System Overview)

Vinnuferðakostnaðarreiknivélin er sjálfstæður eiginleiki sem samþættist við núverandi peninganaedalifid.is forritið. Hún fylgir sömu arkitektúrmynstri og Áskriftakostnaðarreiknivélin (Subscription Burn Meter) - þ.e. client-side React forrit með state management í gegnum CalculatorContext, localStorage fyrir gagnaþráðleika, og sameiginlegir útreiknings- og lífsorku-íhlutir.

**Lykilnálgun**:
- Client-side only útreikningar (engar netbeiðnir nauðsynlegar)
- Samþætting við núverandi CalculatorContext fyrir aðgang að raunverulegu tímakaup
- Stuðningur við allt að 4 samanburðarsviðsmyndir
- Auðveld endurnýting á UI íhlutum úr Subscription Burn Meter
- localStorage fyrir gagnaþráðleika
- Real-time útreikningar við input breytingar

### Arkitektúr Íhluta (Component Architecture)

```
┌─────────────────────────────────────────────────────────────────┐
│                      CalculatorContext                          │
│  (Existing - provides actualHourlyWage and state management)   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              CommuteCalculator (Main Container)                 │
│  - Manages commute scenarios (1-4)                             │
│  - Orchestrates all child components                            │
│  - Handles scenario CRUD operations                             │
└─────────────────────────────────────────────────────────────────┘
           ↓                    ↓                    ↓
    ┌─────────────┐      ┌─────────────┐     ┌──────────────┐
    │ CommuteForm │      │ CommuteSummary│    │CommuteComparison│
    │             │      │               │    │                │
    │ - Input UI  │      │ - Single      │    │ - Multi-scenario│
    │ - Validation│      │   scenario    │    │   comparison   │
    │ - Presets   │      │   results     │    │ - Side-by-side │
    └─────────────┘      └─────────────┘     └──────────────┘
           ↓                    ↓
    ┌─────────────────────────────────┐
    │   Calculation Functions         │
    │   /lib/calculations/commute.ts  │
    │   - Cost calculations           │
    │   - Life energy calculations    │
    │   - Future value (FI impact)    │
    └─────────────────────────────────┘
           ↓
    ┌─────────────────────────────────┐
    │   Data Models (TypeScript)      │
    │   /types/calculator.ts          │
    │   - CommuteScenario             │
    │   - CommuteInputs               │
    │   - CommuteResults              │
    └─────────────────────────────────┘
           ↓
    ┌─────────────────────────────────┐
    │   localStorage Persistence      │
    │   Key: commuteCost_scenarios    │
    └─────────────────────────────────┘
```

### Gagnaflæði (Data Flow)

1. **Notandi opnar reiknivélina**: CommuteCalculator hleður núverandi sviðsmyndum úr CalculatorContext (sem les úr localStorage)

2. **Notandi býr til eða breytir sviðsmynd**:
   - CommuteForm tekur við input gildum
   - Validation keyrir við hverja breytingu
   - Gildi eru send til CalculatorContext fyrir geymingu
   - CalculatorContext keyrir útreikninga í gegnum `/lib/calculations/commute.ts`
   - Niðurstöður eru uppfærðar í rauntíma (< 50ms)

3. **Útreikningar**:
   - Grunnkostnaður reiknast út frá ferðamáta (bíll, strætó, hjól, etc.)
   - Lífsorka kostnaður reiknast með actualHourlyWage úr CalculatorContext
   - Framtíðarvirði (FI impact) reiknast með 7% ársávöxtun
   - Allar niðurstöður eru uppfærðar reactive

4. **Niðurstöður sýndar**:
   - CommuteSummary sýnir einstakar sviðsmyndir
   - CommuteComparison sýnir samanburð á 2-4 sviðsmyndum
   - Niðurstöður innihalda: kostnað, tíma, lífsorku, og framtíðarvirði

5. **Gagnaþráðleiki**:
   - CalculatorContext vistar sjálfkrafa í localStorage (500ms debounce)
   - Export/Import virkni er hluti af CalculatorContext
   - Öll gögn eru client-side only

### Samþættingarpunktar (Integration Points)

**Núverandi kerfi**:
1. **CalculatorContext**:
   - Les `actualHourlyWage` úr aðalreiknivél
   - Stjórnar commute scenarios líkt og subscriptions
   - Býr til `commuteScenarios` fylki í state
   - Veitir `addCommuteScenario`, `updateCommuteScenario`, `deleteCommuteScenario` functions

2. **localStorage**:
   - Víkkar `StoredState` interface til að innihalda `commuteScenarios: CommuteScenario[]`
   - Notar sömu storage patterns og subscriptions

3. **Sameiginlegir utility functons**:
   - `formatCurrency()` - fyrir krónutölur með íslensku sniði
   - `formatNumber()` - fyrir tölur með þúsunda skiptum
   - `formatLifeEnergy()` - fyrir lífsorku túlkun í klst/mín/dögum
   - `dollarsToLifeEnergy()` - fyrir peningar → lífsorku umbreytingu
   - `calculateFutureValue()` - fyrir FI áhrif útreikninga

**Ytri háðir** (engar):
- Engar ytri API beiðnir
- Allt keyrir client-side

### Tækniþáttur (Technology Stack)

| Þáttur | Tækni | Rökstuðningur |
|---------|-------|---------------|
| **UI Framework** | React 18+ með TypeScript | Samræmist núverandi app, type safety, component reuse |
| **State Management** | React Context API (CalculatorContext) | Einfalt, nóg fyrir client-side app, allir aðrir eiginleikar nota þetta |
| **Styling** | Tailwind CSS + shadcn/ui components | Sama patterns og núverandi app, samræmdur útlit |
| **Form Handling** | React useState + validation functions | Létt, fljótt, engin þörf fyrir react-hook-form |
| **Calculations** | Pure TypeScript functions | Testable, reusable, framtíðaröruggt |
| **Persistence** | localStorage | Client-side only, privacy-first, samræmist núverandi app |
| **Validation** | Custom validation functions | Létt, fullt control, Icelandic error messages |

### Hönnunarákvarðanir

#### Ákvörðun 1: Samþætting við CalculatorContext fremur en nýtt Context

**Samhengi**: Þurfum að stjórna commute scenarios og tengjast actualHourlyWage

**Valkostir sem voru metnir**:
1. **Búa til nýtt CommuteContext**
   - Kostir: Aðskilnaður ábyrgðar, læstur í sér
   - Gallar: Tvöfaldun á patterns, flóknari context composition, erfiðara að deila actualHourlyWage
   - Áhætta: Context hell, ósamræmi í patterns

2. **Víkka CalculatorContext** (VALIÐ)
   - Kostir: Eitt state tree, auðvelt að deila actualHourlyWage, samræmi við Subscriptions pattern
   - Gallar: Stærra context, meiri ábyrgð
   - Áhætta: Minni háttar - context er þegar stórt

**Ákvörðun**: Víkka CalculatorContext

**Rökstuðningur**: Subscriptions nota nú þegar þetta pattern með góðum árangri. Commute scenarios eru svipuð á að virka - list of scenarios með CRUD operations. Deilir actualHourlyWage náttúrulega. Fylgir consistency principle.

**Áhrif**: Þarf að uppfæra CalculatorContext með commute methods, CommuteScenario type bætist við StoredState

**Kröfur sem þetta uppfyllir**: NS-1, NS-2, NS-3, NS-4, NS-5

---

#### Ákvörðun 2: Allt að 4 sviðsmyndir fremur en ótakmarkaðar

**Samhengi**: Þurfum að takmarka fjölda sviðsmynda fyrir comparison UI

**Valkostir sem voru metnir**:
1. **Ótakmarkaðar sviðsmyndir**
   - Kostir: Meiri sveigjanleiki
   - Gallar: Comparison UI verður flókið, localStorage getur fyllt upp, cognitive overload
   - Áhætta: Hönnunarvandamál, UX suffering

2. **2 sviðsmyndir aðeins**
   - Kostir: Einfaldur samanburður
   - Gallar: Of takmarkandi - "núverandi, nýtt starf, fjarvinnu, almenningssamgöngur" = 4 algengar sviðsmyndir
   - Áhætta: Notandi verður svekinn

3. **Allt að 4 sviðsmyndir** (VALIÐ)
   - Kostir: Nægilegt fyrir algengar use-cases, comparison UI er viðráðanlegt, fylgir best practice
   - Gallar: Kannski einhver vill fleiri (sjaldgæft)
   - Áhætta: Lítil

**Ákvörðun**: Hámark 4 sviðsmyndir

**Rökstuðningur**: 4 scenarios allow for: "Current commute", "New job option", "Public transit", "Remote/bike alternative". This covers 95% of real-world comparison needs. UI can display 4 scenarios in a comparison table without scrolling on desktop. Aligns with UX best practices (7±2 rule).

**Áhrif**: Validation í UI þarf að koma í veg fyrir 5. sviðsmynd, clear error message

**Kröfur sem þetta uppfyllir**: NS-1.8, NS-5.1

---

#### Ákvörðun 3: Separate form per scenario vs. single form with scenario selector

**Samhengi**: Hvernig notandi skráir og breytir sviðsmyndum

**Valkostir sem voru metnir**:
1. **Single form með scenario selector**
   - Kostir: Minna UI space, eitt form til að viðhalda
   - Gallar: Óljóst workflow, erfitt að bera saman while editing
   - Áhætta: Ruglandi UX

2. **Accordion með form per scenario** (VALIÐ)
   - Kostir: Skýrt workflow, auðvelt að bera saman, fylgir Subscription pattern
   - Gallar: Meira vertical space
   - Áhætta: Lítil - collapsed accordion sparar space

**Ákvörðun**: Accordion með expandable form per scenario

**Rökstuðningur**: Matches Subscription Burn Meter pattern sem er þegar kunnuglegt notendum. Skýrt að hver scenario er aðskilinn. Side-by-side comparison er auðveldara þegar hægt að opna 2+ scenarios samtímis.

**Áhrif**: CommuteForm er reusable component, CommuteCalculator stjórnar lista af scenarios

**Kröfur sem þetta uppfyllir**: NS-1, NS-5

## Íhlutir og Viðmót (Components and Interfaces)

### CommuteCalculator (Aðalíhlutur)

**Tilgangur**: Aðal container component sem sér um að skipuleggja allar vinnuferðareikninga og stýra sviðsmyndum

**Ábyrgð**:
- Render lista af commute scenarios (allt að 4)
- Sjá um að búa til, breyta, og eyða scenarios
- Skipta á milli "scenarios view" og "comparison view"
- Sýna warningar ef actualHourlyWage vantar
- Koordinera CommuteForm, CommuteSummary, og CommuteComparison íhluti

**Public Interface**:
```typescript
interface CommuteCalculatorProps {
  className?: string;
}
```

**Háðir (Dependencies)**:
- `useCalculator()` hook - fyrir aðgang að commuteScenarios, actualHourlyWage
- `CommuteForm` - fyrir scenario input
- `CommuteSummary` - fyrir niðurstöður einstakra scenarios
- `CommuteComparison` - fyrir multi-scenario samanburð

**Athugasemdir við innleiðingu**:
- Notar accordion pattern fyrir scenario lista (líkt og Subscriptions)
- "Bæta við sviðsmynd" takki (disabled ef 4 scenarios already)
- Toggle á milli "Sviðsmyndir" og "Samanburður" views
- Sýnir Alert ef actualHourlyWage === 0 með link að aðalreiknivél

---

### CommuteForm

**Tilgangur**: Form component fyrir að skrá og breyta einni commute scenario

**Ábyrgð**:
- Birta input fields fyrir allar nauðsynlegar upplýsingar
- Dynamic field rendering miðað við ferðamáta (car, transit, bike, walk, remote)
- Real-time validation á öllum inputs
- Preset selector fyrir algengar íslenskar vinnuferðir
- Auto-save á 500ms debounce

**Public Interface**:
```typescript
interface CommuteFormProps {
  mode: 'add' | 'edit';
  scenario?: CommuteScenario; // Required fyrir edit mode
  onSave: (scenario: Omit<CommuteScenario, 'id' | 'results'>) => void;
  onCancel: () => void;
}
```

**Háðir (Dependencies)**:
- `Input` component - fyrir texta og number inputs
- `Select` component - fyrir dropdown vals (ferðamáti, eldsneytistegund, etc.)
- `Button` component - fyrir aðgerðir
- `Card` components - fyrir layout
- `COMMUTE_PRESETS` constant - fyrir preset sviðsmyndir
- `validateCommuteInputs()` function - fyrir validation

**Athugasemdir við innleiðingu**:
- Conditional rendering: Sýnir bara viðeigandi fields miðað við ferðamáta
- Bíll: Eldsneytisverð, eyðsla, stæði, tollar, afskriftir, tryggingar, viðhald, skoðun
- Strætó: Tegund miða (monthly vs per-ride), kostnaður
- Hjól/Ganga: Viðhald
- Fjarvinnu: Engir extra fields (allur kostnaður = 0)
- Preset selector fyllist út með raunhæfum gildum fyrir algengar ferðir
- Validation errors sýndar realtime við hverja breytingu

---

### CommuteSummary

**Tilgangur**: Sýnir niðurstöður fyrir eina commute scenario með ítarlegum upplýsingum

**Ábyrgð**:
- Sýna peningalegan kostnað (beinn + óbeinn fyrir bíla)
- Sýna tíma í vinnuferð (klst á mánuði, ár)
- Sýna lífsorku kostnað (tími + peningar sem klukkustundir)
- Sýna framtíðarvirði (FI impact) ef fjárfest í staðinn
- Sundurliðun á kostnaðarþáttum fyrir bíla
- Sýna impactful messages um lífsorku tap

**Public Interface**:
```typescript
interface CommuteSummaryProps {
  scenario: CommuteScenario;
  actualHourlyWage: number;
  className?: string;
}
```

**Háðir (Dependencies)**:
- `Card` components - fyrir layout
- `formatCurrency()` - fyrir krónutölur
- `formatLifeEnergy()` - fyrir lífsorku texta
- `formatNumber()` - fyrir tölur

**Athugasemdir við innleiðingu**:
- Sýnir warning ef actualHourlyWage === 0
- Fyrir bíla: Pie chart með kostnaðarsundurliðingu (eldsneytis, afskriftir, tryggingar, etc.)
- Impactful messaging: "Vinnuferðir þínar kosta þig 45 klst af lífsorku á mánuði - yfir vinnuviku!"
- FV calculations með 7% ávöxtun fyrir 5, 10, 20 ár
- Color coded sections: Kostnaður (primary), Lífsorka (warning), FV (success)

---

### CommuteComparison

**Tilgangur**: Samanburður á 2-4 commute scenarios side-by-side

**Ábyrgð**:
- Sýna comparison table með helstu metrics fyrir allar scenarios
- Auðkenna ódýrasta og dýrasta valkostinn með litamerkingum
- Reikna og sýna sparnað milli valkosta
- Highlight key differences (kostnaður, tími, lífsorka, FV)
- Responsive design: Table á desktop, stacked cards á mobile

**Public Interface**:
```typescript
interface CommuteComparisonProps {
  scenarios: CommuteScenario[];
  actualHourlyWage: number;
  className?: string;
}
```

**Háðir (Dependencies)**:
- `Card` components
- `formatCurrency()`, `formatLifeEnergy()`, `formatNumber()`
- Comparison calculation functions

**Athugasemdir við innleiðingu**:
- Table columns: Heiti, Ferðamáti (icon), Mánaðarkostnaður, Tími/mán, Lífsorka/mán, FV (10 ár), Munur
- Litamerking: Grænt (best), Gult (middle), Rautt (worst)
- Sparnaðar message: "Með því að skipta úr [worst] í [best] sparar þú X kr og Y klst á mánuði"
- Responsive: Table -> Stacked cards á mobile
- Empty state: "Búðu til að minnsta kosti 2 sviðsmyndir til að bera saman"

---

### CommutePresetSelector

**Tilgangur**: Dropdown fyrir að velja úr forstilltum algengum íslenskum vinnuferðum

**Ábyrgð**:
- Sýna lista af preset sviðsmyndum (bílar, strætó, hjól, fjarvinnu)
- Fylla út form með raunhæfum gildum þegar preset er valið
- Leyfa notanda að customize eftir val

**Public Interface**:
```typescript
interface CommutePresetSelectorProps {
  onSelect: (preset: CommutePreset) => void;
  className?: string;
}
```

**Háðir (Dependencies)**:
- `Select` component
- `COMMUTE_PRESETS` constant array

**Athugasemdir við innleiðingu**:
- Presets innihalda: Kópavogur↔Reykjavík, Hafnarfjörður↔Reykjavík, Mosfellsbær↔Reykjavík, Akranes↔Reykjavík, Selfoss↔Reykjavík
- Strætó presets: Mánaðarkort (10.500 kr), Stakir farmiðar
- Hjólreiðar/Ganga/Fjarvinnu presets
- Default fuel prices: Bensín 300kr/l, Dísel 290kr/l, Rafmagn 30kr/kWh
- Default consumption: Bensín 8l/100km, Dísel 7l/100km, Rafmagn 20kWh/100km

---

### CalculatorContext Extensions

**Tilgangur**: Víkka núverandi CalculatorContext til að styðja commute scenarios

**Nýir state þættir**:
```typescript
interface CalculatorContextType {
  // ... existing fields ...

  // Commute scenarios
  commuteScenarios: CommuteScenario[];
  addCommuteScenario: (scenario: Omit<CommuteScenario, 'id' | 'results'>) => void;
  updateCommuteScenario: (id: string, updates: Partial<CommuteScenario>) => void;
  deleteCommuteScenario: (id: string) => void;
  duplicateCommuteScenario: (id: string) => void;
}
```

**Nýjar ábyrgðir**:
- Geyma allt að 4 commute scenarios í state
- Keyra calculations fyrir hverja scenario með `calculateCommuteResults()`
- Auto-save til localStorage með 500ms debounce
- Validate að ekki meira en 4 scenarios

**Háðir (Dependencies)**:
- `calculateCommuteResults()` - calculation function
- `generateCommuteId()` - ID generator
- localStorage

**Athugasemdir við innleiðingu**:
- Bætir `commuteScenarios: CommuteScenario[]` við `StoredState` interface
- `addCommuteScenario` kastar error ef >= 4 scenarios
- `calculateCommuteResults()` keyrir fyrir hverja scenario við save/update
- Scenarios hafa auto-generated IDs líkt og subscriptions

## Gagnalíkön (Data Models)

### CommuteScenario

**Eiginleikar**:
```typescript
interface CommuteScenario {
  id: string; // Auto-generated unique ID
  name: string; // User-defined name, max 50 chars (e.g., "Núverandi vinna", "Nýtt starf í Kópavogi")
  inputs: CommuteInputs; // All input data
  results: CommuteResults; // Calculated results
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
  isCurrent?: boolean; // Optional flag to mark "current commute"
}
```

**Validation Reglur**:
- `id`: Non-empty string, unique
- `name`: 1-50 characters, required
- `inputs`: Must pass CommuteInputs validation
- `results`: Auto-calculated, cannot be manually set
- `createdAt`, `updatedAt`: Valid ISO 8601 dates

**Tengsl**:
- Belongs to user's scenario list (max 4)
- References actualHourlyWage from CalculatorContext for life energy calculations

**Geymsla**:
- Stored in CalculatorContext state
- Persisted in localStorage under `StoredState.commuteScenarios`

---

### CommuteInputs

**Eiginleikar**:
```typescript
interface CommuteInputs {
  // Basic info
  distanceKm: number; // Distance one-way in km (required, > 0, max 200)
  daysPerWeek: number; // Work days per week (1-7, default 5)
  commuteMethod: CommuteMethod; // car | transit | bike | walk | remote
  timeMinutesOneWay: number; // Time one-way in minutes (required, > 0, max 300)

  // Car-specific (only if commuteMethod === 'car')
  car?: CarCommuteDetails;

  // Transit-specific (only if commuteMethod === 'transit')
  transit?: TransitCommuteDetails;

  // Bike/Walk-specific (only if commuteMethod === 'bike' | 'walk')
  active?: ActiveCommuteDetails;
}
```

**Validation Reglur**:
- `distanceKm`: Required, > 0, <= 200
- `daysPerWeek`: Required, 1-7, integer
- `commuteMethod`: Required, must be one of enum values
- `timeMinutesOneWay`: Required, > 0, <= 300 (5 hours max)
- Conditional validation: If car, `car` object required; if transit, `transit` required, etc.

**Tengsl**:
- Embedded in CommuteScenario
- Used as input for calculateCommuteResults()

**Geymsla**:
- Part of CommuteScenario in localStorage

---

### CarCommuteDetails

**Eiginleikar**:
```typescript
interface CarCommuteDetails {
  fuelType: 'gasoline' | 'diesel' | 'electric'; // Required
  fuelPrice: number; // kr/liter or kr/kWh, required, > 0
  fuelConsumption: number; // liters/100km or kWh/100km, required, > 0
  parkingCostPerDay: number; // ISK per work day, >= 0, default 0
  tollsPerDay: number; // ISK per work day, >= 0, default 0

  // Indirect costs (monthly)
  monthlyDepreciation: number; // ISK, >= 0, default 35000
  monthlyInsurance: number; // ISK, >= 0, default 15000
  monthlyMaintenance: number; // ISK, >= 0, default 10000
  inspectionCost: number; // ISK every 2 years, >= 0, default 12000
}
```

**Validation Reglur**:
- `fuelType`: Required, must be valid enum
- `fuelPrice`: Required, > 0, max 1000 (sanity check)
- `fuelConsumption`: Required, > 0, max 50 (sanity check)
- All costs: >= 0
- Defaults provided for indirect costs based on Icelandic averages

**Tengsl**:
- Optional property of CommuteInputs (only when commuteMethod === 'car')

**Geymsla**:
- Part of CommuteInputs

---

### TransitCommuteDetails

**Eiginleikar**:
```typescript
interface TransitCommuteDetails {
  ticketType: 'monthly' | 'per_ride'; // Required
  monthlyCost?: number; // ISK, required if ticketType === 'monthly'
  costPerRide?: number; // ISK, required if ticketType === 'per_ride'
}
```

**Validation Reglur**:
- `ticketType`: Required
- If `ticketType === 'monthly'`: `monthlyCost` required, > 0
- If `ticketType === 'per_ride'`: `costPerRide` required, > 0
- Defaults: monthlyCost = 10500 (Strætó), costPerRide = 550

**Tengsl**:
- Optional property of CommuteInputs (only when commuteMethod === 'transit')

**Geymsla**:
- Part of CommuteInputs

---

### ActiveCommuteDetails

**Eiginleikar**:
```typescript
interface ActiveCommuteDetails {
  monthlyMaintenanceCost: number; // ISK, >= 0, default 2000 for bike, 0 for walk
}
```

**Validation Reglur**:
- `monthlyMaintenanceCost`: >= 0

**Tengsl**:
- Optional property of CommuteInputs (only when commuteMethod === 'bike' | 'walk')

**Geymsla**:
- Part of CommuteInputs

---

### CommuteResults

**Eiginleikar**:
```typescript
interface CommuteResults {
  // Cost breakdown
  directMonthlyCost: number; // Fuel/transit/maintenance costs
  indirectMonthlyCost: number; // Depreciation, insurance, etc. (car only)
  totalMonthlyCost: number; // Direct + indirect
  totalYearlyCost: number; // Monthly * 12

  // Cost breakdown details (for charts/display)
  costBreakdown: CommuteCostBreakdownItem[];

  // Time breakdown
  timePerMonthMinutes: number; // Total commute time per month
  timePerMonthHours: number; // timePerMonthMinutes / 60
  timePerYearHours: number; // timePerMonthHours * 12
  timePerYearDays: number; // timePerYearHours / 24

  // Life energy calculations
  lifeEnergyFromTime: number; // Hours of life energy from time spent
  lifeEnergyFromMoney: number; // Hours of life energy from money (cost / actualHourlyWage)
  totalLifeEnergyHoursPerMonth: number; // lifeEnergyFromTime + lifeEnergyFromMoney
  totalLifeEnergyHoursPerYear: number; // totalLifeEnergyHoursPerMonth * 12

  // FI Impact (future value if invested instead at 7% annual return)
  futureValue5Years: number;
  futureValue10Years: number;
  futureValue20Years: number;
  futureValueAtRetirement?: number; // If user age is known
}
```

**Validation Reglur**:
- All numeric values must be >= 0
- Results are calculated, not user-input
- If actualHourlyWage === 0, lifeEnergyFromMoney = 0

**Tengsl**:
- Calculated from CommuteInputs + actualHourlyWage
- Embedded in CommuteScenario

**Geymsla**:
- Part of CommuteScenario in localStorage
- Recalculated whenever inputs or actualHourlyWage changes

---

### CommuteCostBreakdownItem

**Eiginleikar**:
```typescript
interface CommuteCostBreakdownItem {
  category: string; // e.g., "Eldsneytis", "Afskriftir", "Tryggingar"
  label: string; // Display label in Icelandic
  monthlyCost: number; // ISK per month
  percentage: number; // % of total cost
}
```

**Validation Reglur**:
- `category`: Non-empty string
- `label`: Non-empty string
- `monthlyCost`: >= 0
- `percentage`: 0-100

**Tengsl**:
- Array property of CommuteResults
- Used for pie chart / breakdown display

**Geymsla**:
- Part of CommuteResults

---

### CommuteMethod (Enum)

**Gildi**:
```typescript
type CommuteMethod = 'car' | 'transit' | 'bike' | 'walk' | 'remote';
```

**Íslenskar merkingar**:
```typescript
const COMMUTE_METHOD_LABELS: Record<CommuteMethod, string> = {
  car: 'Bíll',
  transit: 'Almenningssamgöngur',
  bike: 'Hjólreiðar',
  walk: 'Ganga',
  remote: 'Fjarvinnu'
};
```

---

### CommutePreset

**Eiginleikar**:
```typescript
interface CommutePreset {
  id: string;
  category: 'car' | 'transit' | 'active' | 'remote';
  label: string; // e.g., "Kópavogur ↔ Reykjavík (10 km)"
  description: string; // Brief description
  inputs: CommuteInputs; // Pre-filled input values
}
```

**Validation Reglur**:
- `id`: Unique identifier
- `label`: Non-empty string
- `inputs`: Must pass CommuteInputs validation

**Tengsl**:
- Used by CommutePresetSelector
- Defined as constant array in code

**Geymsla**:
- Hardcoded in /lib/calculations/commute.ts as COMMUTE_PRESETS constant

---

### StoredState Extensions

**Víkkun á núverandi StoredState**:
```typescript
interface StoredState {
  version: number;
  currentInputs: CalculatorInputs;
  scenarios: Scenario[];
  subscriptions: Subscription[];
  commuteScenarios: CommuteScenario[]; // NEW: Array of up to 4 commute scenarios
  lastUpdated: string;
}
```

**Validation Reglur**:
- `commuteScenarios`: Array length <= 4
- Each scenario must pass CommuteScenario validation

**Geymsla**:
- localStorage key: Same as existing (part of StoredState)
- Migrated when version changes

## Villustýring (Error Handling)

### Inntaksvillur (Input Validation Errors)

#### Grunnupplýsingar

**Fjarlægð (distanceKm)**:
- Skilyrði: Verður að vera > 0 og <= 200
- Villuskilaboð: "Fjarlægð verður að vera á milli 0 og 200 km"
- Endurhæfing: Sýnir rauðan ramma á input, disable "Vista" takka þar til löglegt
- Logging: Engin (form validation error)

**Dagar á viku (daysPerWeek)**:
- Skilyrði: Verður að vera 1-7, heiltala
- Villuskilaboð: "Dagar á viku verða að vera á milli 1 og 7"
- Endurhæfing: Sýnir error state, disable save
- Logging: Engin

**Ferðatími (timeMinutesOneWay)**:
- Skilyrði: Verður að vera > 0 og <= 300
- Villuskilaboð: "Ferðatími verður að vera á milli 1 og 300 mínútur"
- Endurhæfing: Sýnir error state, disable save
- Logging: Engin

**Heiti (name)**:
- Skilyrði: 1-50 stafir
- Villuskilaboð: "Heiti má ekki vera tómt" eða "Heiti má ekki vera lengra en 50 stafir"
- Endurhæfing: Sýnir error state
- Logging: Engin

#### Bílakostnaður

**Eldsneytisverð (fuelPrice)**:
- Skilyrði: > 0, < 1000
- Villuskilaboð: "Eldsneytisverð verður að vera á milli 0 og 1000 kr"
- Endurhæfing: Sýnir error, disable save
- Logging: Engin

**Eyðsla (fuelConsumption)**:
- Skilyrði: > 0, < 50
- Villuskilaboð: "Eyðsla verður að vera á milli 0 og 50"
- Endurhæfing: Sýnir error, disable save
- Logging: Engin

**Óbein kostnaður (afskriftir, tryggingar, viðhald)**:
- Skilyrði: >= 0
- Villuskilaboð: "Kostnaður má ekki vera neikvæður"
- Endurhæfing: Sýnir error
- Logging: Engin

#### Almenningssamgöngur

**Mánaðarkostnaður / Kostnaður pr. ferð**:
- Skilyrði: > 0
- Villuskilaboð: "Kostnaður verður að vera hærri en 0 kr"
- Endurhæfing: Sýnir error, disable save
- Logging: Engin

### Kerfivillur (System Errors)

#### Of margar sviðsmyndir

**Staða**: Notandi reynir að búa til 5. sviðsmynd
- Villuboð: "Þú getur aðeins haft 4 sviðsmyndir í einu. Eyddu einni til að búa til nýja."
- Birtist sem: Alert component með warning variant
- Endurhæfing: "Bæta við" takki er disabled þegar 4 scenarios eru til
- Logging: console.warn('Maximum scenarios reached')

#### actualHourlyWage vantar

**Staða**: Notandi hefur ekki fyllt út aðalreiknivél
- Villuboð: "Til að sjá lífsorku kostnað þarftu fyrst að fylla út Raunverulegt Tímakaup í aðalreiknivélinni."
- Birtist sem: Alert með link að aðalreiknivél
- Endurhæfing: Lífsorku sections eru falin eða sýna 0
- Logging: Engin

#### localStorage fullt

**Staða**: localStorage capacity exceeded (mjög ólíklegt)
- Villuboð: "Ekki tókst að vista gögn. Prófaðu að eyða gömlum sviðsmyndum."
- Birtist sem: Alert með error variant
- Endurhæfing: Sýnir "Export Data" takka sem varúð
- Logging: console.error('localStorage quota exceeded', error)

#### Skemmd localStorage gögn

**Staða**: Gögn í localStorage eru invalid/corrupt
- Villuboð: Engin (silent recovery)
- Endurhæfing: Notar sjálfgefin gildi, console.warn('Invalid stored data, using defaults')
- Logging: console.warn('Failed to parse stored commute scenarios', error)

### Útreikningsvillur (Calculation Errors)

#### Division by zero

**Staða**: actualHourlyWage === 0 við lífsorku útreikning
- Endurhæfing: lifeEnergyFromMoney = 0, engar villur
- Villuboð: Engin (handled gracefully)
- Logging: Engin

#### Mjög há gildi

**Staða**: Kostnaður eða tími yfir sanity check limits
- Villuboð: Warning í UI "Þetta virðist mjög hátt - ertu viss um að þetta sé rétt?"
- Endurhæfing: Leyfa samt að vista (edge case support)
- Logging: console.warn('Unusually high value detected', field, value)

### Samfélagsvillur (Concurrency Errors)

Ekki við í þessum eiginleika þar sem:
- Allt er client-side only
- Engar samtímis breytingar frá mörgum tabs (localStorage sync er out of scope fyrir MVP)

### Validation Function Design

**validateCommuteInputs()**:
```typescript
function validateCommuteInputs(inputs: Partial<CommuteInputs>): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  // Basic validation
  if (!inputs.distanceKm || inputs.distanceKm <= 0 || inputs.distanceKm > 200) {
    errors.distanceKm = 'Fjarlægð verður að vera á milli 0 og 200 km';
  }

  if (!inputs.daysPerWeek || inputs.daysPerWeek < 1 || inputs.daysPerWeek > 7) {
    errors.daysPerWeek = 'Dagar á viku verða að vera á milli 1 og 7';
  }

  // ... conditional validation based on commuteMethod

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
```

**Staðsetning**: /lib/validation/commute.ts

### Error Display Patterns

**Inline validation errors**:
- Sýndar undir viðkomandi input field
- Rauður texti með warning icon
- Birtist realtime við breytingu (debounced 300ms)

**Form-level errors**:
- Sýndar efst í formi með Alert component
- Error variant með rauðum lit
- "Vista" takki disabled þar til villa er lagfærð

**Toast notifications** (ekki fyrir validation):
- Notaðar fyrir aðgerðastaðfestingar
- Success: "Sviðsmynd vistuð"
- Error: "Ekki tókst að vista" (localStorage villur)

### Accessibility fyrir villur

**ARIA labels**:
- Öll villuskilaboð tengd við input með `aria-describedby`
- `aria-invalid="true"` á öllum invalid inputs
- `role="alert"` á villuskilaboðum fyrir screen readers

**Keyboard navigation**:
- Focus flyttist á fyrsta invalid field við submit
- Enter á "Vista" með villum triggerar validation og focus á villu

**Screen reader support**:
- Tilkynnar "X villur fundust" þegar form er submitted með villum
- Les villuskilaboð upphátt fyrir hvert field

### Logging Strategy

**Development mode**:
- console.warn fyrir unusual values
- console.error fyrir system errors
- Detailed validation errors í console

**Production mode**:
- Minimal console logging
- Error tracking via analytics (framtíð)
- Silent recovery fyrir minor errors

### Edge Cases

**Jaðartilvik 1: 0 km fjarlægð en tími > 0**:
- Validation error: "Ef fjarlægð er 0, ætti ferðatími líka að vera 0"

**Jaðartilvik 2: Fjarvinnu með tíma/kostnað > 0**:
- Validation warning: "Fjarvinnu ætti ekki að hafa ferðatíma eða kostnað"
- Auto-set tíma og kostnað á 0

**Jaðartilvik 3: Rafbíll með bensín/dísel eyðslu**:
- Ekki mögulegt - conditional fields koma í veg fyrir þetta

**Jaðartilvik 4: Mjög langur ferðatími (>100 mín)**:
- Warning en ekki error: "Þetta er mjög langur ferðatími - ertu viss?"

### Error Recovery

**Óafturkræfar aðgerðir**:
- Eyða sviðsmynd: Sýnir confirmation dialog
  - "Ertu viss um að þú viljir eyða þessari sviðsmynd?"
  - Takkar: "Hætta við" (primary), "Eyða" (danger)

**Afturkræfar aðgerðir**:
- Vista/uppfæra: Engin confirmation (auto-save pattern)

**localStorage failure fallback**:
1. Reyna að vista
2. Ef það mistekst, sýna error
3. Bjóða upp á Export til að vista skrá locally
4. Halda áfram að virka með in-memory state (gögn týnast við refresh)

## Prófunarstefna (Testing Strategy)

### Unit Testing

**Calculation Functions** (`/lib/calculations/commute.ts`):

**Test Coverage Target**: 100% fyrir calculation functions

**Prófunarsvit fyrir calculateCommuteResults()**:
```typescript
describe('calculateCommuteResults', () => {
  describe('Car commute calculations', () => {
    it('calculates fuel cost correctly for gasoline car', () => {
      // Test: 10km, 5 days/week, 300kr/L, 8L/100km
      // Expected: ~520 kr/month fuel cost
    });

    it('calculates electric car costs correctly', () => {
      // Test: 10km, 5 days/week, 30kr/kWh, 20kWh/100km
    });

    it('includes indirect costs (depreciation, insurance, maintenance)', () => {
      // Test: Defaults should be 35000 + 15000 + 10000 + 500 (inspection)
    });

    it('calculates parking and tolls correctly', () => {
      // Test: 1000kr/day parking, 5 days/week
    });
  });

  describe('Transit commute calculations', () => {
    it('calculates monthly pass cost', () => {
      // Test: 10500kr monthly pass
    });

    it('calculates per-ride cost correctly', () => {
      // Test: 550kr/ride * 2 trips/day * 5 days * 4.33 weeks
    });
  });

  describe('Active commute calculations', () => {
    it('calculates bike maintenance costs', () => {
      // Test: 2000kr/month default
    });

    it('sets walk costs to 0', () => {});
  });

  describe('Remote work calculations', () => {
    it('sets all costs to 0 for remote', () => {});
    it('sets all time to 0 for remote', () => {});
  });

  describe('Time calculations', () => {
    it('calculates monthly time correctly', () => {
      // Test: 30 min * 2 trips * 5 days * 4.33 weeks = 260 min/month
    });

    it('converts time to hours and days correctly', () => {});
  });

  describe('Life energy calculations', () => {
    it('calculates life energy from time', () => {
      // Test: 260 min = 4.33 hours
    });

    it('calculates life energy from money', () => {
      // Test: 50000kr cost / 5000kr wage = 10 hours
    });

    it('returns 0 for life energy from money if wage is 0', () => {});

    it('calculates total life energy correctly', () => {
      // Test: time + money life energy
    });
  });

  describe('Future value calculations', () => {
    it('calculates FV for 5, 10, 20 years correctly', () => {
      // Test: 50000kr/month at 7% annual return
      // 10 years: ~8,654,000 kr
    });

    it('handles 0 monthly cost correctly', () => {});
  });

  describe('Cost breakdown', () => {
    it('creates breakdown items with correct percentages', () => {});
    it('creates correct labels in Icelandic', () => {});
  });
});
```

**Test Suite fyrir validateCommuteInputs()**:
```typescript
describe('validateCommuteInputs', () => {
  it('validates distance correctly', () => {
    expect(validate({ distanceKm: 0 }).errors.distanceKm).toBeDefined();
    expect(validate({ distanceKm: 201 }).errors.distanceKm).toBeDefined();
    expect(validate({ distanceKm: 10 }).errors.distanceKm).toBeUndefined();
  });

  it('validates days per week', () => {
    // Test 0, 8, 5
  });

  it('validates time correctly', () => {
    // Test 0, 301, 30
  });

  it('validates conditional car fields', () => {
    // If method=car, car object must be present
  });

  it('validates fuel price range', () => {
    // Test -1, 0, 1001, 300
  });
});
```

**Verkfæri**: Vitest (matches existing app stack)
**Staðsetning**: `/lib/calculations/__tests__/commute.test.ts`

---

### Component Testing

**React Components** - Integration testing fyrir UI logic

**Test Coverage Target**: 80%+ fyrir components

**CommuteForm Tests**:
```typescript
describe('CommuteForm', () => {
  describe('Rendering', () => {
    it('renders all basic fields', () => {});
    it('shows car fields when car method selected', () => {});
    it('hides car fields when other method selected', () => {});
    it('shows transit fields for transit method', () => {});
  });

  describe('Preset selection', () => {
    it('populates form when preset selected', () => {});
    it('allows editing after preset selection', () => {});
  });

  describe('Validation', () => {
    it('shows error for invalid distance', () => {});
    it('disables save button when invalid', () => {});
    it('enables save when all fields valid', () => {});
  });

  describe('Form submission', () => {
    it('calls onSave with correct data', () => {});
    it('calls onCancel when cancel clicked', () => {});
  });
});
```

**CommuteSummary Tests**:
```typescript
describe('CommuteSummary', () => {
  it('displays monthly cost correctly', () => {});
  it('displays yearly cost correctly', () => {});
  it('displays time in Icelandic format', () => {});
  it('shows life energy when wage available', () => {});
  it('hides life energy when wage is 0', () => {});
  it('displays future value calculations', () => {});
  it('shows cost breakdown for cars', () => {});
});
```

**CommuteComparison Tests**:
```typescript
describe('CommuteComparison', () => {
  it('renders comparison table with 2 scenarios', () => {});
  it('identifies cheapest scenario correctly', () => {});
  it('identifies most expensive scenario correctly', () => {});
  it('calculates savings correctly', () => {});
  it('shows empty state with < 2 scenarios', () => {});
  it('renders mobile view correctly', () => {});
});
```

**CommuteCalculator Tests**:
```typescript
describe('CommuteCalculator', () => {
  it('renders list of scenarios', () => {});
  it('allows adding new scenario', () => {});
  it('disables add button at 4 scenarios', () => {});
  it('allows deleting scenario with confirmation', () => {});
  it('switches between scenario and comparison view', () => {});
  it('shows warning when actualHourlyWage missing', () => {});
});
```

**Verkfæri**: React Testing Library + Vitest
**Staðsetning**: `/components/commute/__tests__/`

---

### Integration Testing

**CalculatorContext Integration**:
```typescript
describe('CalculatorContext with Commute', () => {
  it('adds commute scenario to state', () => {});
  it('updates scenario correctly', () => {});
  it('deletes scenario correctly', () => {});
  it('prevents adding 5th scenario', () => {});
  it('auto-saves to localStorage', () => {});
  it('recalculates results when actualHourlyWage changes', () => {});
});
```

**localStorage Integration**:
```typescript
describe('localStorage persistence', () => {
  it('saves scenarios to localStorage', () => {});
  it('loads scenarios from localStorage on mount', () => {});
  it('handles corrupt localStorage data gracefully', () => {});
  it('migrates old version data', () => {});
});
```

**Verkfæri**: Vitest + testing-library
**Staðsetning**: `/context/__tests__/CalculatorContext.commute.test.ts`

---

### End-to-End Testing

**Critical User Flows**:

**Flow 1: Create first commute scenario**:
1. Navigate to commute calculator
2. Click "Bæta við sviðsmynd"
3. Select preset "Kópavogur ↔ Reykjavík"
4. Form auto-fills with data
5. Click "Vista"
6. Verify scenario appears in list
7. Verify results displayed correctly

**Flow 2: Compare multiple scenarios**:
1. Create 2+ scenarios (car, transit)
2. Click "Samanburður" tab
3. Verify comparison table shows both
4. Verify cheapest is highlighted green
5. Verify savings message displayed

**Flow 3: Edit existing scenario**:
1. Create scenario
2. Click edit icon
3. Change distance from 10 to 20 km
4. Click Vista
5. Verify results updated correctly

**Flow 4: Delete scenario**:
1. Create scenario
2. Click delete icon
3. Confirm deletion
4. Verify scenario removed

**Flow 5: Preset selection**:
1. Click "Bæta við"
2. Select "Strætó - Mánaðarkort"
3. Verify fields populated
4. Edit one field
5. Save
6. Verify saved with custom values

**Verkfæri**: Playwright (if E2E is in scope) or manual testing
**Priority**: Medium (can be manual for MVP)

---

### Accessibility Testing

**WCAG 2.1 AA Compliance**:

**Tests**:
- Keyboard navigation (Tab, Shift+Tab, Enter, Escape)
- Screen reader compatibility (VoiceOver, NVDA)
- Color contrast (all text ≥ 4.5:1)
- Focus indicators visible
- ARIA labels correct
- Error messages accessible

**Tools**:
- axe-core (automated)
- Manual testing with VoiceOver
- Keyboard-only testing

**Test cases**:
```typescript
describe('Accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(<CommuteCalculator />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('allows keyboard-only form completion', () => {
    // Tab through all fields
    // Fill out with keyboard
    // Submit with Enter
  });
});
```

---

### Performance Testing

**Metrics**:
- Calculation time: < 50ms
- Render time: < 100ms
- Input responsiveness: < 300ms debounce

**Tests**:
```typescript
describe('Performance', () => {
  it('calculates results in < 50ms', () => {
    const start = performance.now();
    calculateCommuteResults(inputs, wage);
    const end = performance.now();
    expect(end - start).toBeLessThan(50);
  });

  it('handles 4 scenarios without lag', () => {
    // Render 4 scenarios
    // Measure render time
  });
});
```

**Verkfæri**: Vitest + performance.now()

---

### Manual Testing Checklist

**Responsive Design**:
- [ ] Desktop (≥1024px) - all features work
- [ ] Tablet (768-1023px) - layout adapts
- [ ] Mobile (≤767px) - stacked layout, touch-friendly

**Browser Compatibility**:
- [ ] Chrome (latest 2 versions)
- [ ] Firefox (latest 2 versions)
- [ ] Safari (latest 2 versions)
- [ ] Edge (latest 2 versions)

**Icelandic Content**:
- [ ] All labels in Icelandic
- [ ] Currency formatted correctly (50.000 kr)
- [ ] Numbers formatted correctly
- [ ] Error messages in Icelandic

**Edge Cases**:
- [ ] 0 km distance
- [ ] Maximum values (200km, 300min)
- [ ] actualHourlyWage = 0
- [ ] localStorage full
- [ ] Corrupt localStorage data

---

### Testing Tools Summary

| Layer | Tool | Purpose |
|-------|------|---------|
| Unit | Vitest | Pure function testing |
| Component | React Testing Library + Vitest | Component logic testing |
| Integration | Vitest | Context + localStorage |
| E2E | Playwright (optional) or Manual | Full user flows |
| Accessibility | axe-core + manual | WCAG compliance |
| Performance | Vitest + performance API | Speed checks |

---

### Coverage Goals

- **Unit tests**: 100% for calculation functions
- **Component tests**: 80%+ coverage
- **Integration tests**: All critical paths covered
- **E2E tests**: Top 5 user flows (can be manual for MVP)
- **Overall**: 85%+ code coverage

---

### CI/CD Integration

**Pre-commit**:
- Lint checks
- Type checking (TypeScript)
- Unit tests run

**Pre-push**:
- All unit tests
- All component tests
- Coverage check (≥85%)

**PR Checks**:
- All tests pass
- No type errors
- No accessibility violations (axe)
- Build succeeds

**Verkfæri**: GitHub Actions (if applicable) or local pre-commit hooks

## Rekjanleiki Krafna (Requirements Traceability)

Þessi hluti tengir hönnunarþætti við upprunalegar kröfur úr requirements.md skjalinu.

### NS-1: Skrá upplýsingar um vinnuferð

**Hönnunarþættir sem uppfylla þessa kröfu**:

**Arkitektúr**:
- CommuteForm component með dynamic field rendering
- Conditional validation miðað við ferðamáta
- CalculatorContext auto-save með 500ms debounce

**Íhlutir**:
- `CommuteForm`: Input fields fyrir alla nauðsynlega reiti
  - Grunnupplýsingar: heiti, fjarlægð, dagar, ferðamáti, tími
  - Conditional fields: bíll, strætó, hjól, ganga, fjarvinnu
- `CommutePresetSelector`: Flýtival fyrir algengar vinnuferðir

**Gagnalíkön**:
- `CommuteInputs`: Conditional structure með car/transit/active details
- `CarCommuteDetails`: Eldsneytis, stæði, afskriftir, tryggingar
- `TransitCommuteDetails`: Tegund miða, kostnaður
- `ActiveCommuteDetails`: Viðhald

**Validation**:
- `validateCommuteInputs()`: Real-time validation á öllum reitum
- Conditional validation miðað við ferðamáta

**Prófun**:
- Unit tests fyrir validation logic
- Component tests fyrir conditional rendering
- E2E test fyrir "Create first scenario" flow

**Samþykktarviðmið**:
- ✓ NS-1.1: Form með öllum áskildum reitum
- ✓ NS-1.2: Bílareiti sýndir þegar bíll valinn
- ✓ NS-1.3: Almenningssamgöngureiti sýndir þegar strætó valið
- ✓ NS-1.4: Hjól/ganga reiti sýndir
- ✓ NS-1.5: Fjarvinnu með engum extra fields
- ✓ NS-1.6: Real-time updates við input breytingar
- ✓ NS-1.7: localStorage geymsla
- ✓ NS-1.8: Allt að 4 sviðsmyndir studdar

---

### NS-2: Sjá raunverulegan peningalegan kostnað

**Hönnunarþættir**:

**Arkitektúr**:
- Calculation functions í `/lib/calculations/commute.ts`
- Reuse af `calculateFutureValue()` úr subscriptions

**Íhlutir**:
- `CommuteSummary`: Displays all cost breakdowns
- Cost breakdown með pie chart fyrir bíla

**Gagnalíkön**:
- `CommuteResults`: directMonthlyCost, indirectMonthlyCost, totalMonthlyCost, totalYearlyCost
- `CommuteCostBreakdownItem[]`: Sundurliðun fyrir charts

**Útreikningar**:
- Car: Fuel + parking + tolls (direct) + depreciation + insurance + maintenance + inspection (indirect)
- Transit: Monthly pass eða per-ride
- Bike/Walk: Viðhald
- Remote: 0

**Prófun**:
- Unit tests fyrir alla cost calculations
- Component tests fyrir cost display
- Pie chart rendering tests

**Samþykktarviðmið**:
- ✓ NS-2.1: Sýnir beinn og óbeinan kostnað
- ✓ NS-2.2: Óbeinn kostnaður fyrir bíla (afskriftir, tryggingar, viðhald, skoðun)
- ✓ NS-2.3: Sundurliðun á öllum kostnaðarliðum
- ✓ NS-2.4: Samanburður á "eldsneytis" vs "raunverulegur kostnaður"
- ✓ NS-2.5: Ábending um vanmat á bílakostnaði

---

### NS-3: Sjá lífsorku kostnað

**Hönnunarþættir**:

**Arkitektúr**:
- Integration með CalculatorContext fyrir actualHourlyWage
- Reuse af `dollarsToLifeEnergy()` og `formatLifeEnergy()` functions

**Íhlutir**:
- `CommuteSummary`: Life energy section með impactful messaging
- Alert ef actualHourlyWage vantar með link að aðalreiknivél

**Gagnalíkön**:
- `CommuteResults.lifeEnergyFromTime`: Tími í vinnuferð
- `CommuteResults.lifeEnergyFromMoney`: Kostnaður / actualHourlyWage
- `CommuteResults.totalLifeEnergyHoursPerMonth`: Samtals lífsorka

**Útreikningar**:
- Tími í vinnuferð: timeMinutesOneWay * 2 * daysPerWeek * 4.33
- Peningar sem lífsorka: totalMonthlyCost / actualHourlyWage
- Samtals: lifeEnergyFromTime + lifeEnergyFromMoney

**Villustýring**:
- Division by zero handling ef actualHourlyWage === 0
- Warning message ef actualHourlyWage vantar

**Prófun**:
- Unit tests fyrir life energy calculations
- Component tests fyrir conditional display
- Edge case test: actualHourlyWage = 0

**Samþykktarviðmið**:
- ✓ NS-3.1: Sýnir tíma og peningakostnað sem lífsorku
- ✓ NS-3.2: Impactful messaging um lífsorku tap
- ✓ NS-3.3: Sýnir skilaboð ef actualHourlyWage vantar
- ✓ NS-3.4: Notar actualHourlyWage (ekki nafnverð)
- ✓ NS-3.5: Sundurliðun á lífsorku (tími + peningar)

---

### NS-4: Sjá áhrif á fjárhagslegt frelsi (FI)

**Hönnunarþættir**:

**Arkitektúr**:
- Reuse af `calculateFutureValue()` function (7% ávöxtun)

**Íhlutir**:
- `CommuteSummary`: Future value section með color-coded cards

**Gagnalíkön**:
- `CommuteResults.futureValue5Years`
- `CommuteResults.futureValue10Years`
- `CommuteResults.futureValue20Years`
- `CommuteResults.futureValueAtRetirement` (optional)

**Útreikningar**:
- FV = monthlyCost * ((1 + r)^n - 1) / r
- r = 0.07/12 (monthly rate)
- n = years * 12

**Prófun**:
- Unit tests fyrir FV calculations með þekktum gildum
- Component tests fyrir FV display

**Samþykktarviðmið**:
- ✓ NS-4.1: Sýnir framtíðarvirði fyrir 5, 10, 20 ár og við starfslok
- ✓ NS-4.2: Impactful messaging um FI áhrif
- ✓ NS-4.3: Myndræn framsetning
- ✓ NS-4.4: Sýnir hlutfall af FI markmiði (ef þekkt)

---

### NS-5: Bera saman valkosti í vinnuferð

**Hönnunarþættir**:

**Arkitektúr**:
- CalculatorContext manages multiple scenarios (max 4)
- Comparison calculations

**Íhlutir**:
- `CommuteCalculator`: Toggle milli "Scenarios" og "Samanburður" views
- `CommuteComparison`: Side-by-side comparison table
  - Responsive: table á desktop, stacked cards á mobile
  - Color coding: grænt (best), rautt (worst), gult (middle)

**Gagnalíkön**:
- `CommuteScenario[]`: List of up to 4 scenarios
- `isCurrent` flag fyrir að merkja núverandi vinnuferð

**Útreikningar**:
- Identify min/max costs
- Calculate savings between scenarios
- Percentage differences

**Prófun**:
- Component tests fyrir comparison logic
- Responsive rendering tests
- E2E test fyrir "Compare multiple scenarios" flow

**Samþykktarviðmið**:
- ✓ NS-5.1: Allt að 4 sviðsmyndir
- ✓ NS-5.2: Samanburðartafla með öllum metrics
- ✓ NS-5.3: Litamerking (grænt/rautt/gult)
- ✓ NS-5.4: Sparnaðar messaging
- ✓ NS-5.5: Eyða, breyta, afrita sviðsmyndir
- ✓ NS-5.6: Merkja sem "núverandi"

---

### NS-6: Flýtival fyrir algengar íslenskar vinnuferðir

**Hönnunarþættir**:

**Arkitektúr**:
- Preset constants í `/lib/calculations/commute.ts`

**Íhlutir**:
- `CommutePresetSelector`: Dropdown með preset options
- Integration í `CommuteForm`

**Gagnalíkön**:
- `CommutePreset`: id, category, label, description, inputs
- `COMMUTE_PRESETS` constant array

**Presets innifaldir**:
- Bílar: Kópavogur, Hafnarfjörður, Garðabær, Mosfellsbær, Akranes, Selfoss
- Strætó: Mánaðarkort, Stakir farmiðar
- Önnur: Hjól (stutt, miðlungs), Fjarvinnu

**Default gildi**:
- Bensín: 300 kr/L
- Dísel: 290 kr/L
- Rafmagn: 30 kr/kWh
- Eyðsla: 8L/100km (bensín), 7L/100km (dísel), 20kWh/100km (rafmagn)
- Strætó: 10500 kr (monthly), 550 kr (per-ride)

**Prófun**:
- Unit tests fyrir preset data
- Component tests fyrir preset selection og auto-fill

**Samþykktarviðmið**:
- ✓ NS-6.1: Flýtival takki með preset lista
- ✓ NS-6.2: Auto-fill með raunhæfum gildum
- ✓ NS-6.3: Leyfa customization eftir val
- ✓ NS-6.4: Uppfærð verð í kóða
- ✓ NS-6.5: Núverandi Strætó verð

---

### Ekki-virknikröfur (Non-Functional Requirements)

**Afköst**:
- ✓ Calculation time < 50ms (Performance tests)
- ✓ Client-side only calculations (Arkitektúr)
- ✓ Switch scenarios < 100ms (Optimized React)
- ✓ Virkar á tækjum frá síðustu 5 árum (Modern browser support)

**Aðgengi (WCAG 2.1 AA)**:
- ✓ Input labels með aria-labels (Component design)
- ✓ Keyboard navigation (Tab/Shift+Tab/Enter/Escape) (Accessibility tests)
- ✓ Contrast ratio ≥ 4.5:1 (Tailwind color system)
- ✓ Error messages aðgengilegar (aria-describedby, role="alert")
- ✓ Alt-text á íkonum (Component implementation)
- ✓ Screen reader support (VoiceOver, NVDA, TalkBack) (Manual testing)
- ✓ Announce changes (aria-live regions)

**Notendaupplifun**:
- ✓ Allur texti á íslensku (All components)
- ✓ Íslenskt krónutölusnið (formatCurrency with is-IS locale)
- ✓ Tooltip skýringar (UI components)
- ✓ Link að tímakaupsreiknivél ef actualHourlyWage vantar (Alert component)
- ✓ Staðfesting við vistun ("✓ Vistað") (Toast notification)
- ✓ Error message við 5. sviðsmynd (Validation)
- ✓ Confirmation fyrir eyðingu (Dialog component)

**Persónuvernd og gagnageymsla**:
- ✓ localStorage only (Arkitektúr)
- ✓ Engin netbeiðnir (Client-side design)
- ✓ localStorage lykill: `StoredState.commuteScenarios` (Data model)
- ✓ Export/Import support (CalculatorContext integration)
- ✓ Max 4 sviðsmyndir (Validation)
- ✓ localStorage quota error handling (Error handling)

**Samhæfni**:
- ✓ Chrome/Edge/Firefox/Safari (síðustu 2 útgáfur) (Manual testing checklist)
- ✓ Responsive: Desktop/Tablet/Mobile (Component design)
- ✓ Stacked layout á mobile (CommuteComparison responsive design)
- ✓ Touch-friendly (≥44x44px) (Tailwind button sizes)

**Áreiðanleiki**:
- ✓ Graceful error handling (Error handling section)
- ✓ Input validation áður en útreikningar (Validation functions)
- ✓ Red border og error messages (Input component)
- ✓ Division by zero handled (Calculation functions)
- ✓ Sanity checks á háum gildum (Validation)
- ✓ Corrupt localStorage recovery (Error handling)

---

### Takmarkanir og forsendur

**Takmarkanir uppfylltar**:
- ✓ Client-side only (Arkitektúr)
- ✓ Engin ytri API (No external dependencies)
- ✓ Engin GPS/kort integration (Manual distance input)
- ✓ Meðaltöl, ekki rauntímagögn (Default values)
- ✓ Allur texti á íslensku (All components)

**Forsendur uppfylltar**:
- ✓ actualHourlyWage frá aðalreiknivél (CalculatorContext integration)
- ✓ Notandi þekkir vegalengd (Input requirement)
- ✓ Notandi þekkir daga á viku (Input requirement)
- ✓ 7% ávöxtun standard (FI calculations)
- ✓ Íslensk meðaltöl fyrir bílakostnað (Default values)

---

### Árangursviðmið

Hönnunin uppfyllir öll árangursviðmið:

- ✓ Hægt að skrá vinnuferð innan 2 mínútur (Preset selector, simple form)
- ✓ Skýr munur á "augljósum kostnaði" vs "heildar kostnaði" (Cost breakdown display)
- ✓ Skilningur á lífsorku kostnaði (Life energy section með impactful messaging)
- ✓ Samanburður á allt að 4 valkostum (CommuteComparison component)
- ✓ Nákvæmir útreikningar (Unit tests 100% coverage)
- ✓ Skýr framsetning (CommuteSummary með structured display)
- ✓ localStorage persistence (CalculatorContext auto-save)

---

### Tengsl við aðra eiginleika

**Krefst**:
- ✓ Raunverulegt Tímakaup reiknivél fyrir actualHourlyWage (CalculatorContext integration)

**Notar**:
- ✓ Sömu UI íhlutir (Card, Input, Select, Button, Alert)
- ✓ Sömu utility functions (formatCurrency, formatLifeEnergy, etc.)
- ✓ Sömu calculation patterns (calculateFutureValue, dollarsToLifeEnergy)

**Geymt með**:
- ✓ Aðalgögnum í localStorage (StoredState víkkun)

**Hluti af**:
- ✓ "Áhrif Útgjalda" (Expense Impact) flipanum í Phase 2 (Context integration)
