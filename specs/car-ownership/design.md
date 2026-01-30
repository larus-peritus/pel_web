# Hönnun: Bílaeign Kostnaðarreiknivél (Car Ownership Cost Calculator)

## Yfirlit

**Eiginleiki**: Bílaeign Kostnaðarreiknivél
**App**: peninganaedalifid.is
**Requirements**: [requirements.md](./requirements.md)

### Helstu þættir hönnunar

**Arkitektúr**:
- Client-side React forrit með TypeScript
- Samþættist við núverandi CalculatorContext fyrir state management
- Fylgir sömu patterns og Subscription Burn Meter og Commute Cost Analyzer
- Allt að 4 samanburðarsviðsmyndir studdar
- localStorage fyrir gagnaþráðleika

**Íhlutir**:
- **CarOwnershipCalculator**: Aðal container sem stjórnar sviðsmyndum
- **CarOwnershipForm**: Dynamic form með conditional fields fyrir fjármögnun
- **CarOwnershipSummary**: Ítarlegar niðurstöður fyrir eina sviðsmynd
- **CarOwnershipComparison**: Side-by-side samanburður á 2-4 sviðsmyndum
- **CarPresetSelector**: Flýtival fyrir algengar íslenskar bílasviðsmyndir

**Gagnalíkön**:
- **CarOwnershipScenario**: Aðal scenario entity með inputs og results
- **CarOwnershipInputs**: Grunnupplýsingar, fjármögnun, rekstrarkostnaður
- **CarOwnershipResults**: Comprehensive results með kostnaði, lífsorku, FI áhrifum
- **FinancingDetails**: Lánsupplýsingar (ef við á)

**Útreikningar**:
- Beinn kostnaður (eldsneytis, parkering, veggjöld, lánagreiðslur)
- Óbeinn kostnaður (afskriftir, tryggingar, bifreiðagjald, skoðun, viðhald, gúmmí)
- Heildar mánaðarlegur og árlegur kostnaður
- Lífsorku kostnaður (peningar sem klukkustundir)
- Framtíðarvirði ef fjárfest við 7% ávöxtun (5, 10, 20 ár)
- Kostnaðarsundurliðun

**Notendaupplifun**:
- Preset selector fyrir algengar íslenskar bílasviðsmyndir
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
- Performance testing (< 100ms calculations)

### Lykilákvarðanir

1. **Samþæting við CalculatorContext**: Fylgir subscription/commute pattern, deilir actualHourlyWage auðveldlega
2. **Hámark 4 sviðsmyndir**: Nægilegt fyrir algengar use-cases (núverandi bíll, nýr bíll, rafbíll, engin bíll)
3. **Accordion form pattern**: Skýrt workflow, auðveldur samanburður
4. **Conditional form fields**: Sýnir bara fjármögnunarreiti ef lán er valið
5. **Preset support**: Sparar tíma með raunhæfum gildum fyrir algengar íslenskar bílasviðsmyndir
6. **Línuleg afskrift**: Einfalt og skiljanlegt model fyrir verðlækkun

---

## Arkitektúr

### Kerfisyfirlit (System Overview)

Bílaeign Kostnaðarreiknivélin er sjálfstæður eiginleiki sem samþættist við núverandi peninganaedalifid.is forritið. Hún fylgir sömu arkitektúrmynstri og Vinnuferðakostnaðarreiknivélin og Áskriftakostnaðarmælir.

**Lykilnálgun**:
- Client-side only útreikningar (engar netbeiðnir nauðsynlegar)
- Samþætting við núverandi CalculatorContext fyrir aðgang að raunverulegu tímakaup
- Stuðningur við allt að 4 samanburðarsviðsmyndir
- Endurnýting á UI íhlutum úr öðrum reiknivélum
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
│           CarOwnershipCalculator (Main Container)               │
│  - Manages car ownership scenarios (1-4)                       │
│  - Orchestrates all child components                            │
│  - Handles scenario CRUD operations                             │
└─────────────────────────────────────────────────────────────────┘
           ↓                    ↓                    ↓
    ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐
    │CarOwnershipForm│    │CarOwnership  │    │CarOwnership      │
    │                │    │Summary       │    │Comparison        │
    │ - Input UI     │    │              │    │                  │
    │ - Validation   │    │ - Single     │    │ - Multi-scenario │
    │ - Presets      │    │   scenario   │    │   comparison     │
    │ - Conditional  │    │   results    │    │ - Side-by-side   │
    │   financing    │    │              │    │                  │
    └──────────────┘    └──────────────┘    └──────────────────┘
           ↓                    ↓
    ┌─────────────────────────────────┐
    │   Calculation Functions         │
    │   /lib/calculations/car.ts      │
    │   - Cost calculations           │
    │   - Loan payment calculations   │
    │   - Depreciation calculations   │
    │   - Life energy calculations    │
    │   - Future value (FI impact)    │
    └─────────────────────────────────┘
           ↓
    ┌─────────────────────────────────┐
    │   Data Models (TypeScript)      │
    │   /types/calculator.ts          │
    │   - CarOwnershipScenario        │
    │   - CarOwnershipInputs          │
    │   - CarOwnershipResults         │
    └─────────────────────────────────┘
           ↓
    ┌─────────────────────────────────┐
    │   localStorage Persistence      │
    │   Key: carOwnership_scenarios   │
    └─────────────────────────────────┘
```

### Gagnaflæði (Data Flow)

1. **Notandi opnar reiknivélina**: CarOwnershipCalculator hleður núverandi sviðsmyndum úr CalculatorContext (sem les úr localStorage)

2. **Notandi býr til eða breytir sviðsmynd**:
   - CarOwnershipForm tekur við input gildum
   - Validation keyrir við hverja breytingu
   - Gildi eru send til CalculatorContext fyrir geymingu
   - CalculatorContext keyrir útreikninga í gegnum `/lib/calculations/car.ts`
   - Niðurstöður eru uppfærðar í rauntíma (< 100ms)

3. **Útreikningar**:
   - Beinn kostnaður: eldsneytis + parkering + veggjöld + lánagreiðslur
   - Óbeinn kostnaður: afskriftir + tryggingar + bifreiðagjald + skoðun + viðhald + gúmmí
   - Lífsorku kostnaður reiknast með actualHourlyWage úr CalculatorContext
   - Framtíðarvirði (FI impact) reiknast með 7% ársávöxtun
   - Allar niðurstöður eru uppfærðar reactive

4. **Niðurstöður sýndar**:
   - CarOwnershipSummary sýnir einstakar sviðsmyndir
   - CarOwnershipComparison sýnir samanburð á 2-4 sviðsmyndum
   - Niðurstöður innihalda: kostnað, lífsorku, og framtíðarvirði

5. **Gagnaþráðleiki**:
   - CalculatorContext vistar sjálfkrafa í localStorage (500ms debounce)
   - Export/Import virkni er hluti af CalculatorContext
   - Öll gögn eru client-side only

### Samþættingarpunktar (Integration Points)

**Núverandi kerfi**:
1. **CalculatorContext**:
   - Les `actualHourlyWage` úr aðalreiknivél
   - Stjórnar car ownership scenarios líkt og subscriptions og commute
   - Býr til `carOwnershipScenarios` fylki í state
   - Veitir `addCarOwnershipScenario`, `updateCarOwnershipScenario`, `deleteCarOwnershipScenario` functions

2. **localStorage**:
   - Víkkar `StoredState` interface til að innihalda `carOwnershipScenarios: CarOwnershipScenario[]`
   - Notar sömu storage patterns og subscriptions og commute

3. **Sameiginlegir utility functions**:
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

**Samhengi**: Þurfum að stjórna car ownership scenarios og tengjast actualHourlyWage

**Valkostir sem voru metnir**:
1. **Búa til nýtt CarOwnershipContext**
   - Kostir: Aðskilnaður ábyrgðar, læstur í sér
   - Gallar: Tvöfaldun á patterns, flóknari context composition, erfiðara að deila actualHourlyWage
   - Áhætta: Context hell, ósamræmi í patterns

2. **Víkka CalculatorContext** (VALIÐ)
   - Kostir: Eitt state tree, auðvelt að deila actualHourlyWage, samræmi við Subscriptions/Commute pattern
   - Gallar: Stærra context, meiri ábyrgð
   - Áhætta: Minni háttar - context er þegar stórt

**Ákvörðun**: Víkka CalculatorContext

**Rökstuðningur**: Subscriptions og Commute nota þetta pattern með góðum árangri. Car ownership scenarios eru svipuð - list of scenarios með CRUD operations. Deilir actualHourlyWage náttúrulega. Fylgir consistency principle.

**Áhrif**: Þarf að uppfæra CalculatorContext með car ownership methods, CarOwnershipScenario type bætist við StoredState

**Kröfur sem þetta uppfyllir**: NS-1, NS-2, NS-3, NS-4, NS-5

---

#### Ákvörðun 2: Línuleg afskrift fremur en flókið depreciation model

**Samhengi**: Hvernig reikna verðlækkun bíls

**Valkostir sem voru metnir**:
1. **Markaðsgögn API** (t.d. sækja úr bílaauglýsingum)
   - Kostir: Nákvæm markaðsverð
   - Gallar: Krefst backend, privacy issues, API costs, complexity
   - Áhætta: Hátt - brotnar á privacy-first principle

2. **Flókið depreciation model** (fyrstu ár verðlækka hraðar)
   - Kostir: Nákvæmara
   - Gallar: Flókið, erfitt að útskýra, krefst meiri inputs
   - Áhætta: Cognitive overload

3. **Línuleg afskrift** (VALIÐ)
   - Kostir: Einfalt, auðvelt að skilja, nægilega nákvæmt
   - Gallar: Vanmetur verðlækkun fyrstu ár
   - Áhætta: Lítil - notandi getur handvirkt slegið inn nákvæmari afskriftir

**Ákvörðun**: Línuleg afskrift

**Rökstuðningur**:
- Einfalt að útskýra: "Bíll keyptur fyrir 3.000.000 kr með 10 ára líftíma tapar 300.000 kr á ári"
- Client-side only (no API needed)
- Notandi getur alltaf slegið inn custom depreciation gildi
- Nægilega nákvæmt fyrir ákvarðanatöku

**Áhrif**: Depreciation input field með default (purchase price / estimated lifetime years) en leyfa notanda að override

**Kröfur sem þetta uppfyllir**: NS-2, NS-6

---

#### Ákvörðun 3: Allt að 4 sviðsmyndir fremur en ótakmarkaðar

**Samhengi**: Þurfum að takmarka fjölda sviðsmynda fyrir comparison UI

**Valkostir sem voru metnir**:
1. **Ótakmarkaðar sviðsmyndir**
   - Kostir: Meiri sveigjanleiki
   - Gallar: Comparison UI verður flókið, localStorage getur fyllt upp, cognitive overload
   - Áhætta: Hönnunarvandamál, UX suffering

2. **2 sviðsmyndir aðeins**
   - Kostir: Einfaldur samanburður
   - Gallar: Of takmarkandi - "núverandi bíll, nýr bíll, rafbíll, engin bíll" = 4 algengar sviðsmyndir
   - Áhætta: Notandi verður svekinn

3. **Allt að 4 sviðsmyndir** (VALIÐ)
   - Kostir: Nægilegt fyrir algengar use-cases, comparison UI er viðráðanlegt, fylgir best practice
   - Gallar: Kannski einhver vill fleiri (sjaldgæft)
   - Áhætta: Lítil

**Ákvörðun**: Hámark 4 sviðsmyndir

**Rökstuðningur**: 4 scenarios allow for: "Current car", "New affordable car", "New electric car", "No car (alternatives)". This covers 95% of real-world comparison needs. UI can display 4 scenarios in a comparison table without scrolling on desktop. Aligns with UX best practices (7±2 rule). Consistent with Commute calculator.

**Áhrif**: Validation í UI þarf að koma í veg fyrir 5. sviðsmynd, clear error message

**Kröfur sem þetta uppfyllir**: NS-5

---

## Íhlutir og Viðmót (Components and Interfaces)

### CarOwnershipCalculator (Aðalíhlutur)

**Tilgangur**: Aðal container component sem sér um að skipuleggja allar bílaeign reikninga og stýra sviðsmyndum

**Ábyrgð**:
- Render lista af car ownership scenarios (allt að 4)
- Sjá um að búa til, breyta, og eyða scenarios
- Skipta á milli "scenarios view" og "comparison view"
- Sýna warningar ef actualHourlyWage vantar
- Koordinera CarOwnershipForm, CarOwnershipSummary, og CarOwnershipComparison íhluti

**Public Interface**:
```typescript
interface CarOwnershipCalculatorProps {
  className?: string;
}
```

**Háðir (Dependencies)**:
- `useCalculator()` hook - fyrir aðgang að carOwnershipScenarios, actualHourlyWage
- `CarOwnershipForm` - fyrir scenario input
- `CarOwnershipSummary` - fyrir niðurstöður einstakra scenarios
- `CarOwnershipComparison` - fyrir multi-scenario samanburð

**Athugasemdir við innleiðingu**:
- Notar accordion pattern fyrir scenario lista (líkt og Subscriptions/Commute)
- "Bæta við bíl" takki (disabled ef 4 scenarios already)
- Toggle á milli "Bílar" og "Samanburður" views
- Sýnir Alert ef actualHourlyWage === 0 með link að aðalreiknivél

---

### CarOwnershipForm

**Tilgangur**: Form component fyrir að skrá og breyta einni car ownership scenario

**Ábyrgð**:
- Birta input fields fyrir allar nauðsynlegar upplýsingar
- Dynamic field rendering fyrir fjármögnun (conditional)
- Real-time validation á öllum inputs
- Preset selector fyrir algengar íslenskar bílasviðsmyndir
- Auto-save á 500ms debounce

**Public Interface**:
```typescript
interface CarOwnershipFormProps {
  mode: 'add' | 'edit';
  scenario?: CarOwnershipScenario; // Required fyrir edit mode
  onSave: (scenario: Omit<CarOwnershipScenario, 'id' | 'results'>) => void;
  onCancel: () => void;
}
```

**Háðir (Dependencies)**:
- `Input` component - fyrir texta og number inputs
- `Select` component - fyrir dropdown vals (eldsneytistegund, etc.)
- `Toggle` component - fyrir fjármögnun já/nei
- `Button` component - fyrir aðgerðir
- `Card` components - fyrir layout
- `CAR_PRESETS` constant - fyrir preset sviðsmyndir
- `validateCarOwnershipInputs()` function - fyrir validation

**Athugasemdir við innleiðingu**:
- Conditional rendering: Sýnir bara fjármögnunarreiti ef hasFinancing === true
- Sections:
  1. Grunnupplýsingar: Heiti, kaupverð, núverandi markaðsverð
  2. Fjármögnun (conditional): Útborgun, lánsupphæð, vextir, lánstími
  3. Akstur: Mánaðarlegur akstur (km), eldsneytistegund, eyðsla, eldsneytisverð
  4. Árlegur kostnaður: Tryggingar, bifreiðagjald, skoðun, viðhald, gúmmí
  5. Mánaðarlegur kostnaður: Parkering, veggjöld
- Preset selector fyllist út með raunhæfum gildum fyrir algengar bílasviðsmyndir
- Validation errors sýndar realtime við hverja breytingu

---

### CarOwnershipSummary

**Tilgangur**: Sýnir niðurstöður fyrir eina car ownership scenario með ítarlegum upplýsingum

**Ábyrgð**:
- Sýna beinn og óbeinan mánaðarlegan kostnað
- Sýna heildar kostnað (mánuður og ár)
- Sýna lífsorku kostnað (peningar sem klukkustundir)
- Sýna framtíðarvirði (FI impact) ef fjárfest í staðinn
- Sundurliðun á kostnaðarþáttum (pie chart)
- Sýna impactful messages um lífsorku tap

**Public Interface**:
```typescript
interface CarOwnershipSummaryProps {
  scenario: CarOwnershipScenario;
  actualHourlyWage: number;
  className?: string;
}
```

**Háðir (Dependencies)**:
- `Card` components - fyrir layout
- `formatCurrency()` - fyrir krónutölur
- `formatLifeEnergy()` - fyrir lífsorku texta
- `formatNumber()` - fyrir tölur
- Chart library (recharts or similar) - fyrir pie chart

**Athugasemdir við innleiðingu**:
- Sýnir warning ef actualHourlyWage === 0
- Pie chart með kostnaðarsundurliðingu:
  - Eldsneytis
  - Afskriftir
  - Tryggingar
  - Bifreiðagjald
  - Skoðun
  - Viðhald
  - Gúmmí
  - Parkering
  - Veggjöld
  - Lánagreiðslur (ef við á)
- Impactful messaging: "Bíllinn kostar þig 42 klst af lífsorku á mánuði - meira en vinnuvika!"
- FV calculations með 7% ávöxtun fyrir 5, 10, 20 ár
- Color coded sections: Kostnaður (primary), Lífsorka (warning), FV (success)

---

### CarOwnershipComparison

**Tilgangur**: Samanburður á 2-4 car ownership scenarios side-by-side

**Ábyrgð**:
- Sýna comparison table með helstu metrics fyrir allar scenarios
- Auðkenna ódýrasta og dýrasta valkostinn með litamerkingum
- Reikna og sýna sparnað milli valkosta
- Highlight key differences (kostnaður, lífsorka, FV)
- Responsive design: Table á desktop, stacked cards á mobile

**Public Interface**:
```typescript
interface CarOwnershipComparisonProps {
  scenarios: CarOwnershipScenario[];
  actualHourlyWage: number;
  className?: string;
}
```

**Háðir (Dependencies)**:
- `Card` components
- `formatCurrency()`, `formatLifeEnergy()`, `formatNumber()`
- Comparison calculation functions

**Athugasemdir við innleiðingu**:
- Table columns: Heiti, Mánaðarkostnaður, Árlegur kostnaður, Lífsorka/mán, FV (10 ár), Munur
- Litamerking: Grænt (best), Gult (middle), Rautt (worst)
- Sparnaðar message: "Með því að skipta úr [worst] í [best] sparar þú X kr og Y klst á mánuði"
- Responsive: Table -> Stacked cards á mobile
- Empty state: "Búðu til að minnsta kosti 2 bíla til að bera saman"

---

### CarPresetSelector

**Tilgangur**: Dropdown fyrir að velja úr forstilltum algengum íslenskum bílasviðsmyndum

**Ábyrgð**:
- Sýna lista af preset sviðsmyndum (lítill bensínbíll, meðalstór, jeppi, rafbíll, gamall)
- Fylla út form með raunhæfum gildum þegar preset er valið
- Leyfa notanda að customize eftir val

**Public Interface**:
```typescript
interface CarPresetSelectorProps {
  onSelect: (preset: CarPreset) => void;
  className?: string;
}
```

**Háðir (Dependencies)**:
- `Select` component
- `CAR_PRESETS` constant array

**Athugasemdir við innleiðingu**:
- Presets innihalda:
  - Lítill bensínbíll (Toyota Yaris): 2.500.000 kr, 7 L/100km, 130.000 kr tryggingar
  - Meðalstór bensínbíll (Toyota Corolla): 4.000.000 kr, 7.5 L/100km, 150.000 kr tryggingar
  - Stór jeppi (Toyota RAV4): 7.000.000 kr, 9 L/100km, 200.000 kr tryggingar
  - Rafbíll (Tesla Model 3 / Nissan Leaf): 5.000.000 kr, 18 kWh/100km, 120.000 kr tryggingar
  - Gamall bíll (> 15 ára): 800.000 kr, 10 L/100km, 100.000 kr tryggingar
- Default fuel prices: Bensín 300kr/L, Dísel 290kr/L, Rafmagn 30kr/kWh
- Default bifreiðagjald miðað við algeng losun/þyngd
- Default skoðun: 12.000 kr / 2 ár
- Default viðhald: 100.000-200.000 kr / ár eftir bíl
- Default gúmmí: 60.000 kr / 4 ár

---

### CalculatorContext Extensions

**Tilgangur**: Víkka núverandi CalculatorContext til að styðja car ownership scenarios

**Nýir state þættir**:
```typescript
interface CalculatorContextType {
  // ... existing fields ...

  // Car ownership scenarios
  carOwnershipScenarios: CarOwnershipScenario[];
  addCarOwnershipScenario: (scenario: Omit<CarOwnershipScenario, 'id' | 'results'>) => void;
  updateCarOwnershipScenario: (id: string, updates: Partial<CarOwnershipScenario>) => void;
  deleteCarOwnershipScenario: (id: string) => void;
  duplicateCarOwnershipScenario: (id: string) => void;
}
```

**Nýjar ábyrgðir**:
- Geyma allt að 4 car ownership scenarios í state
- Keyra calculations fyrir hverja scenario með `calculateCarOwnershipResults()`
- Auto-save til localStorage með 500ms debounce
- Validate að ekki meira en 4 scenarios

**Háðir (Dependencies)**:
- `calculateCarOwnershipResults()` - calculation function
- `generateCarOwnershipId()` - ID generator
- localStorage

**Athugasemdir við innleiðingu**:
- Bætir `carOwnershipScenarios: CarOwnershipScenario[]` við `StoredState` interface
- `addCarOwnershipScenario` kastar error ef >= 4 scenarios
- `calculateCarOwnershipResults()` keyrir fyrir hverja scenario við save/update
- Scenarios hafa auto-generated IDs líkt og subscriptions/commute

---

## Gagnalíkön (Data Models)

### CarOwnershipScenario

**Eiginleikar**:
```typescript
interface CarOwnershipScenario {
  id: string; // Auto-generated unique ID
  name: string; // User-defined name, max 50 chars (e.g., "Toyota Corolla 2018", "Nýr rafbíll")
  inputs: CarOwnershipInputs; // All input data
  results: CarOwnershipResults; // Calculated results
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
  isCurrent?: boolean; // Optional flag to mark "current car"
}
```

**Validation Reglur**:
- `id`: Non-empty string, unique
- `name`: 1-50 characters, required
- `inputs`: Must pass CarOwnershipInputs validation
- `results`: Auto-calculated, cannot be manually set
- `createdAt`, `updatedAt`: Valid ISO 8601 dates

**Tengsl**:
- Belongs to user's scenario list (max 4)
- References actualHourlyWage from CalculatorContext for life energy calculations

**Geymsla**:
- Stored in CalculatorContext state
- Persisted in localStorage under `StoredState.carOwnershipScenarios`

---

### CarOwnershipInputs

**Eiginleikar**:
```typescript
interface CarOwnershipInputs {
  // Basic info
  purchasePrice: number; // Kaupverð (kr), required, > 0
  currentMarketValue?: number; // Núverandi markaðsverð (optional, for used cars)
  estimatedLifetimeYears: number; // Áætlaður líftími (ár), default 10

  // Financing (optional)
  hasFinancing: boolean; // Lán já/nei
  financing?: FinancingDetails; // Required if hasFinancing === true

  // Driving
  monthlyKm: number; // Mánaðarlegur akstur (km), required, > 0
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid'; // Required
  fuelConsumption: number; // L/100km or kWh/100km, required, > 0
  fuelPrice: number; // kr/L or kr/kWh, required, > 0

  // Annual costs (kr)
  annualInsurance: number; // Tryggingar, required, >= 0
  annualRegistrationTax: number; // Bifreiðagjald, required, >= 0
  biannualInspection: number; // Skoðun á 2 ár, default 12000
  annualMaintenance: number; // Viðhald, required, >= 0
  tiresEveryNYears: number; // Gúmmí á hverja N ár, default 4
  tiresCost: number; // Kostnaður gúmmí, default 60000

  // Monthly costs (kr)
  monthlyParking: number; // Parkering, >= 0, default 0
  monthlyTolls: number; // Veggjöld, >= 0, default 0
}
```

**Validation Reglur**:
- `purchasePrice`: Required, > 0
- `estimatedLifetimeYears`: Required, > 0, <= 30
- `hasFinancing`: Required boolean
- If `hasFinancing === true`: `financing` object required
- `monthlyKm`: Required, > 0, <= 10000 (sanity check)
- `fuelType`: Required, must be valid enum
- `fuelConsumption`: Required, > 0, <= 50
- `fuelPrice`: Required, > 0, <= 1000
- All annual/monthly costs: >= 0

**Tengsl**:
- Embedded in CarOwnershipScenario
- Used as input for calculateCarOwnershipResults()

**Geymsla**:
- Part of CarOwnershipScenario in localStorage

---

### FinancingDetails

**Eiginleikar**:
```typescript
interface FinancingDetails {
  downPayment: number; // Útborgun (kr), >= 0
  loanAmount: number; // Lánsupphæð (kr), > 0
  annualInterestRate: number; // Árleg vextir (%), > 0
  loanTermYears: number; // Lánstími (ár), > 0
}
```

**Validation Reglur**:
- `downPayment`: >= 0
- `loanAmount`: > 0
- `annualInterestRate`: > 0, <= 30 (sanity check)
- `loanTermYears`: > 0, <= 15 (sanity check)
- `downPayment + loanAmount` should ≈ purchasePrice (warning if not)

**Útreikningar**:
- Monthly payment: P * (r * (1+r)^n) / ((1+r)^n - 1)
  - P = loanAmount
  - r = annualInterestRate / 12 / 100
  - n = loanTermYears * 12

**Tengsl**:
- Optional property of CarOwnershipInputs (only when hasFinancing === true)

**Geymsla**:
- Part of CarOwnershipInputs

---

### CarOwnershipResults

**Eiginleikar**:
```typescript
interface CarOwnershipResults {
  // Cost breakdown
  directMonthlyCost: number; // Beinn mánaðarlegur kostnaður
  indirectMonthlyCost: number; // Óbeinn mánaðarlegur kostnaður
  totalMonthlyCost: number; // Heildar mánaðarlegur kostnaður
  totalYearlyCost: number; // Heildar árlegur kostnaður

  // Cost breakdown details (for charts/display)
  costBreakdown: CarCostBreakdownItem[];

  // Direct costs (monthly)
  fuelCostMonthly: number;
  parkingCostMonthly: number;
  tollsCostMonthly: number;
  loanPaymentMonthly: number; // 0 if no financing

  // Indirect costs (annual → monthly average)
  depreciationMonthly: number;
  insuranceMonthly: number;
  registrationTaxMonthly: number;
  inspectionMonthly: number;
  maintenanceMonthly: number;
  tiresMonthly: number;

  // Life energy calculations
  lifeEnergyHoursPerMonth: number; // Total cost / actualHourlyWage
  lifeEnergyHoursPerYear: number; // lifeEnergyHoursPerMonth * 12

  // FI Impact (future value if invested instead at 7% annual return)
  futureValue5Years: number;
  futureValue10Years: number;
  futureValue20Years: number;

  // Loan info (if applicable)
  totalInterestPaid?: number; // Total vextir yfir lánstíma
  totalLoanCost?: number; // Lánsupphæð + vextir
}
```

**Validation Reglur**:
- All numeric values must be >= 0
- Results are calculated, not user-input
- If actualHourlyWage === 0, lifeEnergyHoursPerMonth = 0

**Tengsl**:
- Calculated from CarOwnershipInputs + actualHourlyWage
- Embedded in CarOwnershipScenario

**Geymsla**:
- Part of CarOwnershipScenario in localStorage
- Recalculated whenever inputs or actualHourlyWage changes

---

### CarCostBreakdownItem

**Eiginleikar**:
```typescript
interface CarCostBreakdownItem {
  category: string; // e.g., "Eldsneytis", "Afskriftir", "Tryggingar"
  label: string; // Display label in Icelandic
  monthlyCost: number; // ISK per month
  percentage: number; // % of total cost
  isDirect: boolean; // true for direct costs, false for indirect
}
```

**Validation Reglur**:
- `category`: Non-empty string
- `label`: Non-empty string
- `monthlyCost`: >= 0
- `percentage`: 0-100

**Tengsl**:
- Array property of CarOwnershipResults
- Used for pie chart / breakdown display

**Geymsla**:
- Part of CarOwnershipResults

---

### CarPreset

**Eiginleikar**:
```typescript
interface CarPreset {
  id: string;
  category: 'small' | 'medium' | 'suv' | 'electric' | 'old';
  label: string; // e.g., "Lítill bensínbíll (Toyota Yaris)"
  description: string; // Brief description
  inputs: Omit<CarOwnershipInputs, 'name'>; // Pre-filled input values
}
```

**Validation Reglur**:
- `id`: Unique identifier
- `label`: Non-empty string
- `inputs`: Must pass CarOwnershipInputs validation

**Tengsl**:
- Used by CarPresetSelector
- Defined as constant array in code

**Geymsla**:
- Hardcoded in /lib/calculations/car.ts as CAR_PRESETS constant

---

### StoredState Extensions

**Víkkun á núverandi StoredState**:
```typescript
interface StoredState {
  version: number;
  currentInputs: CalculatorInputs;
  scenarios: Scenario[];
  subscriptions: Subscription[];
  commuteScenarios: CommuteScenario[];
  carOwnershipScenarios: CarOwnershipScenario[]; // NEW: Array of up to 4 car scenarios
  lastUpdated: string;
}
```

**Validation Reglur**:
- `carOwnershipScenarios`: Array length <= 4
- Each scenario must pass CarOwnershipScenario validation

**Geymsla**:
- localStorage key: Same as existing (part of StoredState)
- Migrated when version changes

---

## Útreikningar (Calculations)

### Beinn mánaðarlegur kostnaður (Direct Monthly Costs)

```typescript
// Fuel cost per month
fuelCostMonthly = (monthlyKm * fuelConsumption / 100) * fuelPrice

// Parking
parkingCostMonthly = monthlyParking

// Tolls
tollsCostMonthly = monthlyTolls

// Loan payment (if hasFinancing)
if (hasFinancing) {
  const r = annualInterestRate / 12 / 100; // Monthly rate
  const n = loanTermYears * 12; // Total months
  loanPaymentMonthly = loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
} else {
  loanPaymentMonthly = 0;
}

// Total direct monthly
directMonthlyCost = fuelCostMonthly + parkingCostMonthly + tollsCostMonthly + loanPaymentMonthly
```

### Óbeinn mánaðarlegur kostnaður (Indirect Monthly Costs)

```typescript
// Depreciation (linear)
const depreciationPerYear = purchasePrice / estimatedLifetimeYears;
depreciationMonthly = depreciationPerYear / 12;

// Or if currentMarketValue is provided (more accurate):
if (currentMarketValue) {
  const totalDepreciation = purchasePrice - currentMarketValue;
  depreciationMonthly = totalDepreciation / 12; // Assuming 1 year depreciation
}

// Insurance
insuranceMonthly = annualInsurance / 12;

// Registration tax (bifreiðagjald)
registrationTaxMonthly = annualRegistrationTax / 12;

// Inspection
inspectionMonthly = biannualInspection / 24; // Every 2 years

// Maintenance
maintenanceMonthly = annualMaintenance / 12;

// Tires
tiresMonthly = tiresCost / (tiresEveryNYears * 12);

// Total indirect monthly
indirectMonthlyCost = depreciationMonthly + insuranceMonthly + registrationTaxMonthly
                      + inspectionMonthly + maintenanceMonthly + tiresMonthly;
```

### Heildar kostnaður (Total Costs)

```typescript
totalMonthlyCost = directMonthlyCost + indirectMonthlyCost;
totalYearlyCost = totalMonthlyCost * 12;
```

### Lífsorku kostnaður (Life Energy Cost)

```typescript
if (actualHourlyWage > 0) {
  lifeEnergyHoursPerMonth = totalMonthlyCost / actualHourlyWage;
  lifeEnergyHoursPerYear = lifeEnergyHoursPerMonth * 12;
} else {
  lifeEnergyHoursPerMonth = 0;
  lifeEnergyHoursPerYear = 0;
}
```

### Framtíðarvirði (Future Value)

```typescript
// Future value of monthly savings at 7% annual return
function calculateFutureValue(monthlySavings: number, years: number): number {
  const monthlyRate = 0.07 / 12;
  const months = years * 12;
  return monthlySavings * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
}

futureValue5Years = calculateFutureValue(totalMonthlyCost, 5);
futureValue10Years = calculateFutureValue(totalMonthlyCost, 10);
futureValue20Years = calculateFutureValue(totalMonthlyCost, 20);
```

### Lánsútreikningar (Loan Calculations)

```typescript
if (hasFinancing) {
  const totalPayments = loanPaymentMonthly * (loanTermYears * 12);
  totalInterestPaid = totalPayments - loanAmount;
  totalLoanCost = totalPayments;
}
```

### Kostnaðarsundurliðun (Cost Breakdown)

```typescript
const costBreakdown: CarCostBreakdownItem[] = [
  {
    category: 'fuel',
    label: 'Eldsneytis',
    monthlyCost: fuelCostMonthly,
    percentage: (fuelCostMonthly / totalMonthlyCost) * 100,
    isDirect: true,
  },
  {
    category: 'depreciation',
    label: 'Afskriftir',
    monthlyCost: depreciationMonthly,
    percentage: (depreciationMonthly / totalMonthlyCost) * 100,
    isDirect: false,
  },
  // ... other breakdown items
].sort((a, b) => b.monthlyCost - a.monthlyCost); // Sort by cost descending
```

---

## Villustýring (Error Handling)

### Inntaksvillur (Input Validation Errors)

#### Grunnupplýsingar

**Kaupverð (purchasePrice)**:
- Skilyrði: Verður að vera > 0
- Villuskilaboð: "Kaupverð verður að vera hærra en 0 kr"
- Endurhæfing: Sýnir rauðan ramma á input, disable "Vista" takka þar til löglegt

**Áætlaður líftími (estimatedLifetimeYears)**:
- Skilyrði: Verður að vera > 0 og <= 30
- Villuskilaboð: "Líftími verður að vera á milli 1 og 30 ár"
- Endurhæfing: Sýnir error state, disable save

**Mánaðarlegur akstur (monthlyKm)**:
- Skilyrði: Verður að vera > 0 og <= 10000
- Villuskilaboð: "Mánaðarlegur akstur verður að vera á milli 1 og 10000 km"
- Endurhæfing: Sýnir error state, disable save

#### Fjármögnun

**Lánsupphæð (loanAmount)**:
- Skilyrði: > 0 ef hasFinancing === true
- Villuskilaboð: "Lánsupphæð verður að vera hærri en 0 kr"
- Endurhæfing: Sýnir error, disable save

**Árleg vextir (annualInterestRate)**:
- Skilyrði: > 0 og <= 30
- Villuskilaboð: "Vextir verða að vera á milli 0% og 30%"
- Endurhæfing: Sýnir error, disable save

**Útborgun + Lán ≠ Kaupverð**:
- Skilyrði: downPayment + loanAmount ≈ purchasePrice (±5%)
- Villuskilaboð (warning): "Athugið: Útborgun + lán passa ekki við kaupverð"
- Endurhæfing: Leyfa samt að vista (warning en ekki error)

#### Eldsneytis

**Eldsneytisverð (fuelPrice)**:
- Skilyrði: > 0, < 1000
- Villuskilaboð: "Eldsneytisverð verður að vera á milli 0 og 1000 kr"
- Endurhæfing: Sýnir error, disable save

**Eyðsla (fuelConsumption)**:
- Skilyrði: > 0, < 50
- Villuskilaboð: "Eyðsla verður að vera á milli 0 og 50"
- Endurhæfing: Sýnir error, disable save

### Kerfivillur (System Errors)

#### Of margar sviðsmyndir

**Staða**: Notandi reynir að búa til 5. sviðsmynd
- Villuboð: "Þú getur aðeins haft 4 bíla í einu. Eyddu einum til að búa til nýjan."
- Birtist sem: Alert component með warning variant
- Endurhæfing: "Bæta við" takki er disabled þegar 4 scenarios eru til

#### actualHourlyWage vantar

**Staða**: Notandi hefur ekki fyllt út aðalreiknivél
- Villuboð: "Til að sjá lífsorku kostnað þarftu fyrst að fylla út Raunverulegt Tímakaup í aðalreiknivélinni."
- Birtist sem: Alert með link að aðalreiknivél
- Endurhæfing: Lífsorku sections eru falin eða sýna 0

#### localStorage fullt

**Staða**: localStorage capacity exceeded (mjög ólíklegt)
- Villuboð: "Ekki tókst að vista gögn. Prófaðu að eyða gömlum bílum."
- Birtist sem: Alert með error variant
- Endurhæfing: Sýnir "Export Data" takka sem varúð

#### Skemmd localStorage gögn

**Staða**: Gögn í localStorage eru invalid/corrupt
- Villuboð: Engin (silent recovery)
- Endurhæfing: Notar sjálfgefin gildi, console.warn('Invalid stored data, using defaults')

### Útreikningsvillur (Calculation Errors)

#### Division by zero

**Staða**: actualHourlyWage === 0 við lífsorku útreikning
- Endurhæfing: lifeEnergyHoursPerMonth = 0, engar villur
- Villuboð: Engin (handled gracefully)

**Staða**: estimatedLifetimeYears === 0 við afskriftar
- Endurhæfing: Notar default 10 ár
- Villuboð: Engin (handled gracefully)

#### Mjög há gildi

**Staða**: Kostnaður yfir sanity check limits
- Villuboð: Warning í UI "Þetta virðist mjög hátt - ertu viss um að þetta sé rétt?"
- Endurhæfing: Leyfa samt að vista (edge case support)

---

## Prófunarstefna (Testing Strategy)

### Unit Testing

**Calculation Functions** (`/lib/calculations/car.ts`):

**Test Coverage Target**: 100% fyrir calculation functions

**Prófunarsvit fyrir calculateCarOwnershipResults()**:
```typescript
describe('calculateCarOwnershipResults', () => {
  describe('Direct costs', () => {
    it('calculates fuel cost correctly for gasoline car', () => {
      // Test: 1500 km/month, 7.5 L/100km, 300 kr/L
      // Expected: 3375 kr/month
    });

    it('calculates fuel cost correctly for electric car', () => {
      // Test: 1500 km/month, 18 kWh/100km, 30 kr/kWh
      // Expected: 810 kr/month
    });

    it('includes parking cost', () => {});
    it('includes tolls cost', () => {});
  });

  describe('Loan calculations', () => {
    it('calculates monthly loan payment correctly', () => {
      // Test: 3M kr, 5 years, 7% interest
      // Expected: ~59,406 kr/month
    });

    it('calculates total interest paid', () => {});
    it('returns 0 for loan payment when no financing', () => {});
  });

  describe('Indirect costs', () => {
    it('calculates linear depreciation correctly', () => {
      // Test: 4M kr purchase, 10 years
      // Expected: 33,333 kr/month
    });

    it('calculates insurance monthly correctly', () => {
      // Test: 150,000 kr/year
      // Expected: 12,500 kr/month
    });

    it('calculates registration tax monthly', () => {});
    it('calculates inspection monthly (biannual)', () => {});
    it('calculates maintenance monthly', () => {});
    it('calculates tires monthly', () => {});
  });

  describe('Total costs', () => {
    it('sums direct and indirect costs correctly', () => {});
    it('calculates yearly cost as monthly * 12', () => {});
  });

  describe('Life energy calculations', () => {
    it('calculates life energy from cost', () => {
      // Test: 80,000 kr/month cost, 5000 kr wage
      // Expected: 16 hours/month
    });

    it('returns 0 for life energy when wage is 0', () => {});
  });

  describe('Future value calculations', () => {
    it('calculates FV for 5, 10, 20 years correctly', () => {
      // Test: 80,000 kr/month at 7% annual return
      // 10 years: ~13,800,000 kr
    });

    it('handles 0 monthly cost correctly', () => {});
  });

  describe('Cost breakdown', () => {
    it('creates breakdown items with correct percentages', () => {});
    it('sorts breakdown by cost descending', () => {});
    it('marks direct vs indirect correctly', () => {});
  });
});
```

**Test Suite fyrir validateCarOwnershipInputs()**:
```typescript
describe('validateCarOwnershipInputs', () => {
  it('validates purchase price correctly', () => {});
  it('validates estimated lifetime years', () => {});
  it('validates monthly km', () => {});
  it('validates financing fields when hasFinancing is true', () => {});
  it('does not require financing fields when hasFinancing is false', () => {});
  it('validates fuel price range', () => {});
  it('validates fuel consumption range', () => {});
  it('warns when downPayment + loanAmount != purchasePrice', () => {});
});
```

**Verkfæri**: Vitest (matches existing app stack)
**Staðsetning**: `/lib/calculations/__tests__/car.test.ts`

---

### Component Testing

**React Components** - Integration testing fyrir UI logic

**Test Coverage Target**: 80%+ fyrir components

**CarOwnershipForm Tests**:
```typescript
describe('CarOwnershipForm', () => {
  describe('Rendering', () => {
    it('renders all basic fields', () => {});
    it('shows financing fields when hasFinancing is true', () => {});
    it('hides financing fields when hasFinancing is false', () => {});
  });

  describe('Preset selection', () => {
    it('populates form when preset selected', () => {});
    it('allows editing after preset selection', () => {});
  });

  describe('Validation', () => {
    it('shows error for invalid purchase price', () => {});
    it('shows error for invalid loan amount', () => {});
    it('disables save button when invalid', () => {});
    it('enables save when all fields valid', () => {});
  });

  describe('Form submission', () => {
    it('calls onSave with correct data', () => {});
    it('calls onCancel when cancel clicked', () => {});
  });
});
```

**CarOwnershipSummary Tests**:
```typescript
describe('CarOwnershipSummary', () => {
  it('displays monthly cost correctly', () => {});
  it('displays yearly cost correctly', () => {});
  it('displays life energy when wage available', () => {});
  it('hides life energy when wage is 0', () => {});
  it('displays future value calculations', () => {});
  it('shows cost breakdown pie chart', () => {});
  it('shows loan info when financing exists', () => {});
});
```

**CarOwnershipComparison Tests**:
```typescript
describe('CarOwnershipComparison', () => {
  it('renders comparison table with 2 scenarios', () => {});
  it('identifies cheapest scenario correctly', () => {});
  it('identifies most expensive scenario correctly', () => {});
  it('calculates savings correctly', () => {});
  it('shows empty state with < 2 scenarios', () => {});
  it('renders mobile view correctly', () => {});
});
```

**Verkfæri**: React Testing Library + Vitest
**Staðsetning**: `/components/car-ownership/__tests__/`

---

### Integration Testing

**CalculatorContext Integration**:
```typescript
describe('CalculatorContext with Car Ownership', () => {
  it('adds car ownership scenario to state', () => {});
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
});
```

**Verkfæri**: Vitest + testing-library
**Staðsetning**: `/context/__tests__/CalculatorContext.car.test.ts`

---

### End-to-End Testing

**Critical User Flows**:

**Flow 1: Create first car scenario**:
1. Navigate to car ownership calculator
2. Click "Bæta við bíl"
3. Select preset "Meðalstór bensínbíll"
4. Form auto-fills with data
5. Click "Vista"
6. Verify scenario appears in list
7. Verify results displayed correctly

**Flow 2: Create car with financing**:
1. Create new car scenario
2. Toggle "Fjármögnun" on
3. Fill in loan details
4. Save
5. Verify loan payment appears in summary

**Flow 3: Compare multiple cars**:
1. Create 2+ scenarios (current car, new electric car)
2. Click "Samanburður" tab
3. Verify comparison table shows both
4. Verify cheapest is highlighted green
5. Verify savings message displayed

**Flow 4: Edit existing scenario**:
1. Create scenario
2. Click edit icon
3. Change monthly km from 1500 to 2000
4. Click Vista
5. Verify results updated correctly

**Verkfæri**: Playwright (if E2E is in scope) or manual testing

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

---

### Performance Testing

**Metrics**:
- Calculation time: < 100ms
- Render time: < 100ms
- Input responsiveness: < 300ms debounce

**Tests**:
```typescript
describe('Performance', () => {
  it('calculates results in < 100ms', () => {
    const start = performance.now();
    calculateCarOwnershipResults(inputs, wage);
    const end = performance.now();
    expect(end - start).toBeLessThan(100);
  });

  it('handles 4 scenarios without lag', () => {
    // Render 4 scenarios
    // Measure render time
  });
});
```

---

### Coverage Goals

- **Unit tests**: 100% for calculation functions
- **Component tests**: 80%+ coverage
- **Integration tests**: All critical paths covered
- **E2E tests**: Top 5 user flows (can be manual for MVP)
- **Overall**: 85%+ code coverage

---

## Rekjanleiki Krafna (Requirements Traceability)

### NS-1: Skrá upplýsingar um bíl

**Hönnunarþættir sem uppfylla þessa kröfu**:

**Arkitektúr**:
- CarOwnershipForm component með dynamic field rendering
- Conditional fields fyrir fjármögnun
- CalculatorContext auto-save með 500ms debounce

**Íhlutir**:
- `CarOwnershipForm`: Input fields fyrir alla nauðsynlega reiti
  - Grunnupplýsingar: heiti, kaupverð, líftími
  - Fjármögnun (conditional): útborgun, lán, vextir, lánstími
  - Akstur: mánaðarlegur akstur, eldsneytistegund, eyðsla, verð
  - Árlegur kostnaður: tryggingar, bifreiðagjald, skoðun, viðhald, gúmmí
  - Mánaðarlegur kostnaður: parkering, veggjöld
- `CarPresetSelector`: Flýtival fyrir algengar bílasviðsmyndir

**Gagnalíkön**:
- `CarOwnershipInputs`: Öll nauðsynleg gögn
- `FinancingDetails`: Lánsupplýsingar (conditional)

**Validation**:
- `validateCarOwnershipInputs()`: Real-time validation á öllum reitum

**Prófun**:
- Unit tests fyrir validation logic
- Component tests fyrir conditional rendering
- E2E test fyrir "Create first car" flow

**Samþykktarviðmið**:
- ✓ NS-1.1: Form með öllum áskildum reitum
- ✓ NS-1.2: Fjármögnunarreiti sýndir þegar lán er valið
- ✓ NS-1.3: Allir grunnkostnaðir settir inn
- ✓ NS-1.4: Allar upplýsingar validate
- ✓ NS-1.5: localStorage geymsla

---

### NS-2: Sjá heildarkostnað á mánuði

**Hönnunarþættir**:

**Arkitektúr**:
- Calculation functions í `/lib/calculations/car.ts`

**Íhlutir**:
- `CarOwnershipSummary`: Displays all cost breakdowns
- Cost breakdown með pie chart

**Gagnalíkön**:
- `CarOwnershipResults`: directMonthlyCost, indirectMonthlyCost, totalMonthlyCost, totalYearlyCost
- `CarCostBreakdownItem[]`: Sundurliðun fyrir charts

**Útreikningar**:
- Beinn: eldsneytis + parkering + veggjöld + lán
- Óbeinn: afskriftir + tryggingar + bifreiðagjald + skoðun + viðhald + gúmmí
- Heildar: beinn + óbeinn

**Prófun**:
- Unit tests fyrir alla cost calculations
- Component tests fyrir cost display
- Pie chart rendering tests

**Samþykktarviðmið**:
- ✓ NS-2.1: Sýnir beinn og óbeinan kostnað
- ✓ NS-2.2: Afskriftir reiknaðar rétt
- ✓ NS-2.3: Sundurliðun á öllum kostnaðarliðum með myndriti

---

### NS-3: Sjá lífsorku kostnað

**Hönnunarþættir**:

**Arkitektúr**:
- Integration með CalculatorContext fyrir actualHourlyWage
- Reuse af `dollarsToLifeEnergy()` og `formatLifeEnergy()` functions

**Íhlutir**:
- `CarOwnershipSummary`: Life energy section með impactful messaging
- Alert ef actualHourlyWage vantar með link að aðalreiknivél

**Gagnalíkön**:
- `CarOwnershipResults.lifeEnergyHoursPerMonth`: Kostnaður / actualHourlyWage
- `CarOwnershipResults.lifeEnergyHoursPerYear`: Árleg lífsorka

**Útreikningar**:
- Lífsorka = totalMonthlyCost / actualHourlyWage
- Division by zero handling

**Villustýring**:
- Warning message ef actualHourlyWage === 0

**Prófun**:
- Unit tests fyrir life energy calculations
- Component tests fyrir conditional display
- Edge case test: actualHourlyWage = 0

**Samþykktarviðmið**:
- ✓ NS-3.1: Sýnir lífsorku klst á mánuði og ári
- ✓ NS-3.2: Notar actualHourlyWage (ekki nafnverð)
- ✓ NS-3.3: Skilaboð ef actualHourlyWage vantar
- ✓ NS-3.4: Impactful messaging

---

### NS-4: Sjá áhrif á fjárhagslegt frelsi (FI)

**Hönnunarþættir**:

**Arkitektúr**:
- Reuse af `calculateFutureValue()` function (7% ávöxtun)

**Íhlutir**:
- `CarOwnershipSummary`: Future value section með color-coded cards

**Gagnalíkön**:
- `CarOwnershipResults.futureValue5Years`
- `CarOwnershipResults.futureValue10Years`
- `CarOwnershipResults.futureValue20Years`

**Útreikningar**:
- FV = monthlyCost * ((1 + r)^n - 1) / r
- r = 0.07/12, n = years * 12

**Prófun**:
- Unit tests fyrir FV calculations
- Component tests fyrir FV display

**Samþykktarviðmið**:
- ✓ NS-4.1: Sýnir framtíðarvirði fyrir 5, 10, 20 ár
- ✓ NS-4.2: Impactful messaging um FI áhrif

---

### NS-5: Bera saman valkosti

**Hönnunarþættir**:

**Arkitektúr**:
- CalculatorContext manages multiple scenarios (max 4)

**Íhlutir**:
- `CarOwnershipCalculator`: Toggle milli "Bílar" og "Samanburður" views
- `CarOwnershipComparison`: Side-by-side comparison table
  - Responsive: table á desktop, stacked cards á mobile
  - Color coding: grænt (best), rautt (worst), gult (middle)

**Gagnalíkön**:
- `CarOwnershipScenario[]`: List of up to 4 scenarios
- `isCurrent` flag fyrir að merkja núverandi bíl

**Útreikningar**:
- Identify min/max costs
- Calculate savings between scenarios

**Prófun**:
- Component tests fyrir comparison logic
- Responsive rendering tests
- E2E test fyrir "Compare multiple cars" flow

**Samþykktarviðmið**:
- ✓ NS-5.1: Allt að 4 sviðsmyndir
- ✓ NS-5.2: Samanburðartafla með öllum metrics
- ✓ NS-5.3: Litamerking
- ✓ NS-5.4: Eyða, breyta, afrita sviðsmyndir

---

### NS-6: Íslenskt samhengi

**Hönnunarþættir**:

**Arkitektúr**:
- Preset constants í `/lib/calculations/car.ts`

**Íhlutir**:
- Allir components með íslenskum textum
- `formatCurrency()` með is-IS locale

**Gagnalíkön**:
- `CAR_PRESETS` með íslenskum sjálfgildum

**Defaults**:
- Tryggingar: 100.000-200.000 kr
- Bifreiðagjald: Dæmigerð gildi
- Skoðun: 12.000 kr / 2 ár
- Eldsneytisverð: 300 kr/L (bensín), 290 kr/L (dísel), 30 kr/kWh (rafmagn)
- Gúmmí: 60.000 kr / 4 ár

**Prófun**:
- Unit tests fyrir preset data
- Manual testing fyrir íslenskt númerasnið

**Samþykktarviðmið**:
- ✓ NS-6.1: Íslensk sjálfgildi
- ✓ NS-6.2: Íslenskt númerasnið
- ✓ NS-6.3: Allar niðurstöður í krónum
- ✓ NS-6.4: Öll viðmót á íslensku

---

### NS-7: Flýtival fyrir algengar sviðsmyndir

**Hönnunarþættir**:

**Arkitektúr**:
- Preset constants í `/lib/calculations/car.ts`

**Íhlutir**:
- `CarPresetSelector`: Dropdown með preset options
- Integration í `CarOwnershipForm`

**Gagnalíkön**:
- `CarPreset`: id, category, label, description, inputs
- `CAR_PRESETS` constant array

**Presets innifaldir**:
- Lítill bensínbíll (Toyota Yaris)
- Meðalstór bensínbíll (Toyota Corolla)
- Stór jeppi (Toyota RAV4)
- Rafbíll (Tesla Model 3 / Nissan Leaf)
- Gamall bíll (> 15 ára)

**Prófun**:
- Unit tests fyrir preset data
- Component tests fyrir preset selection og auto-fill
- E2E test fyrir preset workflow

**Samþykktarviðmið**:
- ✓ NS-7.1: Flýtival með algengum bílum
- ✓ NS-7.2: Auto-fill með raunhæfum gildum
- ✓ NS-7.3: Leyfa customization eftir val

---

### Ekki-virknikröfur (Non-Functional Requirements)

**Afköst**:
- ✓ Calculation time < 100ms (Performance tests)
- ✓ Client-side only calculations (Arkitektúr)

**Aðgengi (WCAG 2.1 AA)**:
- ✓ Keyboard navigation (Accessibility tests)
- ✓ Screen reader support (Manual testing)
- ✓ Contrast ratio ≥ 4.5:1 (Tailwind color system)

**Notendaupplifun**:
- ✓ Allur texti á íslensku (All components)
- ✓ Íslenskt krónutölusnið (formatCurrency with is-IS locale)
- ✓ Tooltip skýringar (UI components)
- ✓ Staðfesting við vistun (Toast notification)
- ✓ Confirmation fyrir eyðingu (Dialog component)

**Persónuvernd og gagnageymsla**:
- ✓ localStorage only (Arkitektúr)
- ✓ Engin netbeiðnir (Client-side design)
- ✓ Export/Import support (CalculatorContext integration)
- ✓ Max 4 sviðsmyndir (Validation)

**Samhæfni**:
- ✓ Chrome/Edge/Firefox/Safari (Manual testing checklist)
- ✓ Responsive: Desktop/Tablet/Mobile (Component design)
- ✓ Touch-friendly (Tailwind button sizes)

**Áreiðanleiki**:
- ✓ Graceful error handling (Error handling section)
- ✓ Input validation (Validation functions)
- ✓ Division by zero handled (Calculation functions)

---

### Takmarkanir og forsendur

**Takmarkanir uppfylltar**:
- ✓ Client-side only (Arkitektúr)
- ✓ Engin ytri API (No external dependencies)
- ✓ Handvirk innslátt (Input forms)

**Forsendur uppfylltar**:
- ✓ actualHourlyWage frá aðalreiknivél (CalculatorContext integration)
- ✓ Notandi þekkir grunngögn (Input requirements)
- ✓ 7% ávöxtun standard (FI calculations)
- ✓ Línuleg afskrift (Depreciation model)

---

### Árangursviðmið

Hönnunin uppfyllir öll árangursviðmið:

- ✓ Hægt að skrá bíl innan 3 mínútur (Preset selector, simple form)
- ✓ Skýr munur á "augljósum kostnaði" vs "heildar kostnaði" (Cost breakdown display)
- ✓ Skilningur á lífsorku kostnaði (Life energy section með impactful messaging)
- ✓ Samanburður á allt að 4 valkostum (CarOwnershipComparison component)
- ✓ Nákvæmir útreikningar (Unit tests 100% coverage)
- ✓ Skýr framsetning (CarOwnershipSummary með structured display)
- ✓ localStorage persistence (CalculatorContext auto-save)

---

## Næstu skref

1. Innleiða TypeScript types í `/types/calculator.ts`
2. Búa til calculation functions í `/lib/calculations/car.ts`
3. Útfæra validation í `/lib/validation/car.ts`
4. Bæta við CalculatorContext extensions
5. Búa til preset constants (`CAR_PRESETS`)
6. Byggja React components í `/components/car-ownership/`
7. Skrifa unit tests
8. Skrifa component tests
9. Manual testing á responsive design og accessibility
10. Integration testing með CalculatorContext
