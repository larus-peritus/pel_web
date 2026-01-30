# Design Document: Húsnæðiskostnaðarreiknivél (Housing Impact Calculator)

## Yfirlit

Húsnæðiskostnaðarreiknivélin er nýr eiginleiki sem bætist við peninganaedalifid.is forritið. Hún hjálpar notendum að skilja raunverulegan kostnað húsnæðisákvarðana - leiga vs kaupa, áhrif vaxta og lánstíma, og langtímaáhrif á fjárhagslegt frelsi (FI).

### Helstu þættir hönnunar

**Arkitektúr**:
- Client-side React forrit með TypeScript
- Samþættist við núverandi CalculatorContext fyrir state management
- Fylgir sömu patterns og Subscription Burn Meter og Commute Calculator
- Allt að 4 samanburðarsviðsmyndir studdar
- localStorage fyrir gagnaþráðleika
- Flókinn lánaútreikningur með stuðningi við verðtryggð og óverðtryggð lán

**Íhlutir**:
- **HousingCalculator**: Aðal container sem stjórnar sviðsmyndum
- **HousingForm**: Dynamic form með conditional fields miðað við húsnæðistegund
- **HousingSummary**: Ítarlegar niðurstöður fyrir eina sviðsmynd
- **HousingComparison**: Side-by-side samanburður á 2-4 sviðsmyndum
- **RentVsBuyAnalysis**: Sérstakur component fyrir leiga vs kaupa greiningu
- **LoanAmortizationChart**: Myndrænni framsetning vaxta/höfuðstóls yfir tíma

**Gagnalíkön**:
- **HousingScenario**: Aðal scenario entity með inputs og results
- **HousingInputs**: Conditional structure miðað við húsnæðistegund (rental, owned_with_loan, owned_paid_off)
- **HousingResults**: Comprehensive results með kostnaði, lífsorku, FI áhrifum, og lánaupplýsingum
- Sérhæfðir detail types: RentalDetails, LoanDetails, OwnedPaidOffDetails

**Útreikningar**:
- Lánaútreikningar: Óverðtryggð (standard amortization) og verðtryggð (indexed með verðbólgu)
- Mánaðarkostnaður: Leiga/lán + fasteignagjöld + tryggingar + viðhald + félagsgjöld + hiti + rafmagn
- Lífsorku kostnaður: Mánaðarkostnaður → klukkustundir með actualHourlyWage
- Framtíðarvirði ef fjárfest við 7% ávöxtun (5, 10, 20 ár)
- Fórnarkostnaður fyrir greidda eignarhluti

**Notendaupplifun**:
- Conditional form miðað við húsnæðistegund
- Real-time validation með Icelandic error messages
- Responsive design (desktop, tablet, mobile)
- Impactful messaging um vaxtagreiðslur og lífsorku tap
- Color-coded comparison (grænt=best, rautt=worst)
- Sérstök greining fyrir leiga vs kaupa og endurfjármögnun

**Villustýring**:
- Comprehensive validation á öllum inputs
- Graceful handling ef actualHourlyWage vantar
- localStorage failure fallback
- Edge case handling (division by zero, mjög há lán, óeðlilega háir vextir)
- WCAG 2.1 AA accessible error messages

**Prófun**:
- 100% unit test coverage fyrir calculations (loan formulas, cost breakdowns)
- 80%+ component test coverage
- Integration tests fyrir CalculatorContext
- E2E tests fyrir critical user flows
- Accessibility testing (axe-core + manual)
- Performance testing (< 50ms calculations)

### Lykilákvarðanir

1. **Samþæting við CalculatorContext**: Fylgir subscription/commute pattern, deilir actualHourlyWage auðveldlega
2. **Hámark 4 sviðsmyndir**: Nægilegt fyrir algengar use-cases, viðráðanlegt UI
3. **Tvær lánstegundir stuðning**: Verðtryggð og óverðtryggð fyrir íslensku lánirnar
4. **Einfölduð verðtryggingarformúla**: Notar (vextir + verðbólga) fyrir nálgun, ekki fullkomið CPI
5. **Conditional form fields**: Sýnir bara viðeigandi fields miðað við húsnæðistegund
6. **Aðskilin greining fyrir rent vs buy**: Dedicated component þegar báðar tegundir eru til samanburðar

### Tækniþáttur

- **Frontend**: React 18+ með TypeScript
- **State**: React Context API (CalculatorContext)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Validation**: Custom functions með Icelandic messages
- **Testing**: Vitest + React Testing Library
- **Storage**: localStorage (client-side only)
- **Charts**: Recharts fyrir loan amortization visualization

### Næstu skref

1. Innleiða TypeScript types í `/types/calculator.ts`
2. Búa til calculation functions í `/lib/calculations/housing.ts`
3. Útfæra validation í `/lib/validation/housing.ts`
4. Bæta við CalculatorContext extensions
5. Byggja React components í `/components/housing/`
6. Skrifa unit tests
7. Skrifa component tests
8. Manual testing á responsive design og accessibility

## Arkitektúr

### Kerfisyfirlit (System Overview)

Húsnæðiskostnaðarreiknivélin er sjálfstæður eiginleiki sem samþættist við núverandi peninganaedalifid.is forritið. Hún fylgir sömu arkitektúrmynstri og Vinnuferðakostnaðarreiknivélin (Commute Calculator) - þ.e. client-side React forrit með state management í gegnum CalculatorContext, localStorage fyrir gagnaþráðleika, og sameiginlegir útreiknings- og lífsorku-íhlutir.

**Lykilnálgun**:
- Client-side only útreikningar (engar netbeiðnir nauðsynlegar)
- Samþætting við núverandi CalculatorContext fyrir aðgang að raunverulegu tímakaup
- Stuðningur við allt að 4 samanburðarsviðsmyndir
- Auðveld endurnýting á UI íhlutum úr Commute Calculator og Subscription Burn Meter
- localStorage fyrir gagnaþráðleika
- Real-time útreikningar við input breytingar
- Flóknir lánaútreikningar fyrir íslensk verðtryggð og óverðtryggð lán

### Arkitektúr Íhluta (Component Architecture)

```
┌─────────────────────────────────────────────────────────────────┐
│                      CalculatorContext                          │
│  (Existing - provides actualHourlyWage and state management)   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              HousingCalculator (Main Container)                 │
│  - Manages housing scenarios (1-4)                             │
│  - Orchestrates all child components                            │
│  - Handles scenario CRUD operations                             │
│  - Triggers rent vs buy analysis when applicable               │
└─────────────────────────────────────────────────────────────────┘
       ↓                    ↓                    ↓                ↓
┌─────────────┐      ┌─────────────┐     ┌──────────────┐  ┌──────────────┐
│ HousingForm │      │HousingSummary│    │HousingComparison│ │RentVsBuyAnalysis│
│             │      │               │    │                │ │                │
│ - Input UI  │      │ - Single      │    │ - Multi-scenario│ │ - Rent vs Buy │
│ - Validation│      │   scenario    │    │   comparison   │ │   specific    │
│ - Conditional│     │   results     │    │ - Side-by-side │ │   analysis    │
│   fields    │      │ - Loan details│    │ - Best/worst   │ │                │
└─────────────┘      └─────────────┘     └──────────────┘  └──────────────┘
       ↓                    ↓
┌─────────────────────────────────┐
│   Calculation Functions         │
│   /lib/calculations/housing.ts  │
│   - Loan calculations           │
│   - Cost calculations           │
│   - Life energy calculations    │
│   - Future value (FI impact)    │
│   - Rent vs buy logic           │
└─────────────────────────────────┘
       ↓
┌─────────────────────────────────┐
│   Data Models (TypeScript)      │
│   /types/calculator.ts          │
│   - HousingScenario             │
│   - HousingInputs               │
│   - HousingResults              │
│   - LoanDetails                 │
└─────────────────────────────────┘
       ↓
┌─────────────────────────────────┐
│   localStorage Persistence      │
│   Key: housingImpact_scenarios  │
└─────────────────────────────────┘
```

### Gagnaflæði (Data Flow)

1. **Notandi opnar reiknivélina**: HousingCalculator hleður núverandi sviðsmyndum úr CalculatorContext (sem les úr localStorage)

2. **Notandi býr til eða breytir sviðsmynd**:
   - HousingForm tekur við input gildum
   - Validation keyrir við hverja breytingu
   - Conditional fields birtast miðað við húsnæðistegund (rental, owned_with_loan, owned_paid_off)
   - Gildi eru send til CalculatorContext fyrir geymingu
   - CalculatorContext keyrir útreikninga í gegnum `/lib/calculations/housing.ts`
   - Niðurstöður eru uppfærðar í rauntíma (< 50ms)

3. **Útreikningar**:
   - **Rental**: Leiga + hitakostnaður (ef ekki innifalið) + rafmagnskostnaður (ef ekki innifalið)
   - **Owned with loan**: Mánaðarleg lánsgreiðsla (standard eða indexed amortization) + fasteignagjöld + tryggingar + viðhald + félagsgjöld + hiti + rafmagn
   - **Owned paid off**: Fasteignagjöld + tryggingar + viðhald + félagsgjöld + hiti + rafmagn (+ fórnarkostnaður ef eignarvirði skráð)
   - Lífsorka kostnaður reiknast með actualHourlyWage úr CalculatorContext
   - Framtíðarvirði (FI impact) reiknast með 7% ársávöxtun
   - Allar niðurstöður eru uppfærðar reactive

4. **Niðurstöður sýndar**:
   - HousingSummary sýnir einstakar sviðsmyndir með sundurliðun á kostnaði, lífsorku, FI áhrifum
   - HousingComparison sýnir samanburð á 2-4 sviðsmyndum
   - RentVsBuyAnalysis sýnir sérstaka greiningu ef leiguhúsnæði og eignarhúsnæði eru til samanburðar
   - LoanAmortizationChart sýnir myndræna framsetningu á vöxtum/höfuðstóli yfir lánstíma

5. **Gagnaþráðleiki**:
   - CalculatorContext vistar sjálfkrafa í localStorage (500ms debounce)
   - Export/Import virkni er hluti af CalculatorContext
   - Öll gögn eru client-side only

### Samþættingarpunktar (Integration Points)

**Núverandi kerfi**:
1. **CalculatorContext**:
   - Les `actualHourlyWage` úr aðalreiknivél
   - Stjórnar housing scenarios líkt og subscriptions og commute scenarios
   - Býr til `housingScenarios` fylki í state
   - Veitir `addHousingScenario`, `updateHousingScenario`, `deleteHousingScenario`, `duplicateHousingScenario` functions

2. **localStorage**:
   - Víkkar `StoredState` interface til að innihalda `housingScenarios: HousingScenario[]`
   - Notar sömu storage patterns og subscriptions og commute

3. **Sameiginlegir utility functons**:
   - `formatCurrency()` - fyrir krónutölur með íslensku sniði
   - `formatNumber()` - fyrir tölur með þúsunda skiptum
   - `formatLifeEnergy()` - fyrir lífsorku túlkun í klst/mín/dögum
   - `dollarsToLifeEnergy()` - fyrir peningar → lífsorku umbreytingu
   - `calculateFutureValue()` - fyrir FI áhrif útreikninga (reusable)

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
| **Charts** | Recharts (optional) | Lightweight, responsive, fyrir loan amortization visualization |

### Hönnunarákvarðanir

#### Ákvörðun 1: Samþæting við CalculatorContext fremur en nýtt Context

**Samhengi**: Þurfum að stjórna housing scenarios og tengjast actualHourlyWage

**Valkostir sem voru metnir**:
1. **Búa til nýtt HousingContext**
   - Kostir: Aðskilnaður ábyrgðar, læstur í sér
   - Gallar: Tvöfaldun á patterns, flóknari context composition, erfiðara að deila actualHourlyWage
   - Áhætta: Context hell, ósamræmi í patterns

2. **Víkka CalculatorContext** (VALIÐ)
   - Kostir: Eitt state tree, auðvelt að deila actualHourlyWage, samræmi við Subscriptions og Commute patterns
   - Gallar: Stærra context, meiri ábyrgð
   - Áhætta: Minni háttar - context er þegar stórt og hefur tekist á við mörg features

**Ákvörðun**: Víkka CalculatorContext

**Rökstuðningur**: Subscriptions og Commute nota nú þegar þetta pattern með góðum árangri. Housing scenarios eru svipuð á að virka - list of scenarios með CRUD operations. Deilir actualHourlyWage náttúrulega. Fylgir consistency principle.

**Áhrif**: Þarf að uppfæra CalculatorContext með housing methods, HousingScenario type bætist við StoredState

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
   - Gallar: Of takmarkandi - "núverandi, minni íbúð, kaupa, leiga" = 4 algengar sviðsmyndir
   - Áhætta: Notandi verður svekinn

3. **Allt að 4 sviðsmyndir** (VALIÐ)
   - Kostir: Nægilegt fyrir algengar use-cases, comparison UI er viðráðanlegt, fylgir best practice
   - Gallar: Kannski einhver vill fleiri (sjaldgæft)
   - Áhætta: Lítil

**Ákvörðun**: Hámark 4 sviðsmyndir

**Rökstuðningur**: 4 scenarios allow for: "Current housing", "Smaller apartment", "Buy option", "Cheaper rental". This covers 95% of real-world comparison needs. UI can display 4 scenarios in a comparison table without scrolling on desktop. Aligns with UX best practices (7±2 rule). Consistent with Commute Calculator.

**Áhrif**: Validation í UI þarf að koma í veg fyrir 5. sviðsmynd, clear error message

**Kröfur sem þetta uppfyllir**: NS-1.7, NS-5.1

---

#### Ákvörðun 3: Tvær lánstegundir stuðning (verðtryggð og óverðtryggð)

**Samhengi**: Íslensk húsnæðislán eru annað hvort verðtryggð (indexed) eða óverðtryggð (non-indexed)

**Valkostir sem voru metnir**:
1. **Bara óverðtryggð lán (standard amortization)**
   - Kostir: Einfaldari útreikningar, algeng formúla
   - Gallar: Vantar íslensku sérstöðuna, flest íslensk lán eru verðtryggð
   - Áhætta: Ekki raunhæft fyrir íslenska notendur

2. **Bara verðtryggð lán**
   - Kostir: Einföld tegund
   - Gallar: Sumir íslendingar eru með óverðtryggð lán, takmarkað
   - Áhætta: Ekki nægjanlega sveigjanlegt

3. **Báðar tegundir** (VALIÐ)
   - Kostir: Raunhæft fyrir allar íslenskar aðstæður, notandi velur sem við á
   - Gallar: Tvöfaldun á lánaformúlum, flóknari conditional logic
   - Áhætta: Minni háttar - báðar formúlur eru vel þekktar

**Ákvörðun**: Styðja báðar lánstegundir

**Rökstuðningur**: Íslensk húsnæðislán eru oft verðtryggð, en óverðtryggð eru líka algeng. Notendur þurfa að geta reiknað báðar tegundir til að taka upplýsta ákvörðun. Formúlurnar eru vel þekktar og testable. Conditional logic er viðráðanleg með TypeScript discriminated unions.

**Áhrif**: HousingForm þarf conditional fields fyrir lánstegund, calculations þurfa tvær formúlur, validation þarf að meðhöndla báðar

**Kröfur sem þetta uppfyllir**: NS-1.3, NS-2.2, NS-2.6

---

#### Ákvörðun 4: Einfölduð verðtryggingarformúla (vextir + verðbólga) fremur en fullkomið CPI

**Samhengi**: Verðtryggð lán í raun tengjast Consumer Price Index (CPI) sem breytist mánaðarlega

**Valkostir sem voru metnir**:
1. **Fullkominn CPI útreikningur með rauntíma gögnum**
   - Kostir: Nákvæmur, raunhæfur
   - Gallar: Þarf API tengingu við Hagstofu Íslands, flókið, brotið gegn client-side only constraint
   - Áhætta: Dependency á ytri kerfi, ekki privacy-first

2. **Einfölduð nálgun: (vextir + verðbólga)** (VALIÐ)
   - Kostir: Einfalt, client-side, nægjanlega nákvæmt fyrir áætlanir, user-controlled verðbólgu
   - Gallar: Ekki fullkomlega nákvæmt (vantar mánaðarlegar CPI breytingar)
   - Áhætta: Notandi gæti haldið að þetta sé nákvæmur útreikningur

**Ákvörðun**: Nota einfalda nálgun með (vextir + verðbólga)

**Rökstuðningur**: Þetta er "good enough" fyrir FIRE planning og áætlanir. Notandi getur breytt verðbólguforsendum (default 3.5%). Fylgir privacy-first principle (engin API). Skýrt documented að þetta er áætlun, ekki lögfræðilega nákvæmur útreikningur. Villuskilaboð sýna að þetta er einfölduð nálgun.

**Áhrif**: Calculations nota (vextir + verðbólga) fyrir verðtryggð lán, UI sýnir ábendingu um að þetta er einfölduð nálgun

**Kröfur sem þetta uppfyllir**: NS-1.3, NS-2.6

---

#### Ákvörðun 5: Aðskilin greining fyrir "Leiga vs Kaupa"

**Samhengi**: Notendur vilja oft sjá beina samanburð á leiga vs kaupa

**Valkostir sem voru metnir**:
1. **Integrated í general comparison table**
   - Kostir: Einfaldari architecture, minna kóða
   - Gallar: Flókið að sýna rent vs buy specific metrics í almennri töflu
   - Áhætta: Cognitive overload, mikilvægar upplýsingar týndar

2. **Dedicated RentVsBuyAnalysis component** (VALIÐ)
   - Kostir: Skýrt, focused analysis, auðvelt að sýna specific metrics (breakeven, pros/cons)
   - Gallar: Viðbótarkóði, þarf logic til að triggera component
   - Áhætta: Minni háttar - conditional rendering er einfalt

**Ákvörðun**: Dedicated component fyrir rent vs buy

**Rökstuðningur**: Leiga vs kaupa er ein algengasta spurningin í húsnæðisákvörðunum. Notendur þurfa clear, focused analysis sem sýnir breakeven point, monthly cost differences, long-term impact. Dedicated component gerir þetta skýrara en almenn comparison tafla.

**Áhrif**: Þarf að búa til RentVsBuyAnalysis component, triggera það þegar rental og owned_with_loan eru til samanburðar

**Kröfur sem þetta uppfyllir**: NS-6

---

## Íhlutir og Viðmót (Components and Interfaces)

### HousingCalculator (Aðalíhlutur)

**Tilgangur**: Aðal container component sem sér um að skipuleggja allar húsnæðisreikninga og stýra sviðsmyndum

**Ábyrgð**:
- Render lista af housing scenarios (allt að 4)
- Sjá um að búa til, breyta, og eyða scenarios
- Skipta á milli "scenarios view" og "comparison view"
- Triggera RentVsBuyAnalysis þegar við á (rental + owned scenarios)
- Sýna warningar ef actualHourlyWage vantar
- Koordinera HousingForm, HousingSummary, HousingComparison, RentVsBuyAnalysis íhluti

**Public Interface**:
```typescript
interface HousingCalculatorProps {
  className?: string;
}
```

**Háðir (Dependencies)**:
- `useCalculator()` hook - fyrir aðgang að housingScenarios, actualHourlyWage
- `HousingForm` - fyrir scenario input
- `HousingSummary` - fyrir niðurstöður einstakra scenarios
- `HousingComparison` - fyrir multi-scenario samanburð
- `RentVsBuyAnalysis` - fyrir leiga vs kaupa greiningu

**Athugasemdir við innleiðingu**:
- Notar accordion pattern fyrir scenario lista (líkt og Subscriptions og Commute)
- "Bæta við sviðsmynd" takki (disabled ef 4 scenarios already)
- Toggle á milli "Sviðsmyndir" og "Samanburður" views
- Sýnir Alert ef actualHourlyWage === 0 með link að aðalreiknivél
- Triggerar RentVsBuyAnalysis ef >= 1 rental og >= 1 owned_with_loan scenario

---

### HousingForm

**Tilgangur**: Form component fyrir að skrá og breyta einni housing scenario

**Ábyrgð**:
- Birta input fields fyrir allar nauðsynlegar upplýsingar
- Dynamic field rendering miðað við húsnæðistegund (rental, owned_with_loan, owned_paid_off)
- Dynamic field rendering fyrir lánstegund (indexed, non_indexed) þegar með lán
- Real-time validation á öllum inputs
- Auto-save á 500ms debounce

**Public Interface**:
```typescript
interface HousingFormProps {
  mode: 'add' | 'edit';
  scenario?: HousingScenario; // Required fyrir edit mode
  onSave: (scenario: Omit<HousingScenario, 'id' | 'results'>) => void;
  onCancel: () => void;
}
```

**Háðir (Dependencies)**:
- `Input` component - fyrir texta og number inputs
- `Select` component - fyrir dropdown vals (húsnæðistegund, lánstegund)
- `Checkbox` component - fyrir "Hitakostnaður innifalinn?" etc.
- `Button` component - fyrir aðgerðir
- `Card` components - fyrir layout
- `validateHousingInputs()` function - fyrir validation

**Athugasemdir við innleiðingu**:
- **Step 1: Veljaa húsnæðistegund** (rental, owned_with_loan, owned_paid_off)
- **Conditional rendering miðað við húsnæðistegund**:
  - **Rental**: Leiga, hitakostnaður innifalinn?, rafmagnskostnaður innifalinn?, hita kr (ef ekki), rafmagn kr (ef ekki)
  - **Owned with loan**: Lánstegund val → Conditional fyrir indexed/non-indexed
    - Báðar tegundir: Heildarupphæð láns, ársvextir, lánstími
    - Indexed only: Verðbólga á ári (%)
    - Báðar: Fasteignagjöld, tryggingar, viðhald, félagsgjöld, hiti, rafmagn
  - **Owned paid off**: Eignarvirði (valfrjálst, fyrir fórnarkostnað), fasteignagjöld, tryggingar, viðhald, félagsgjöld, hiti, rafmagn
- Validation errors sýndar realtime við hverja breytingu

---

### HousingSummary

**Tilgangur**: Sýnir niðurstöður fyrir eina housing scenario með ítarlegum upplýsingum

**Ábyrgð**:
- Sýna mánaðarlegan og árlegan kostnað (heildar + sundurliðun)
- Fyrir lán: Sýna mánaðarlega lánsgreiðslu, heildar vaxtagreiðslur, hlutfall vaxta
- Sýna lífsorku kostnað (klst, dagar, vinnudagar, vinnuvikur)
- Sýna framtíðarvirði (FI impact) ef fjárfest í staðinn
- Fyrir verðtryggð lán: Sýna ábendingu um að greiðslur hækka með verðbólgu
- Sýna impactful messages um lífsorku tap og vaxtagreiðslur

**Public Interface**:
```typescript
interface HousingSummaryProps {
  scenario: HousingScenario;
  actualHourlyWage: number;
  className?: string;
}
```

**Háðir (Dependencies)**:
- `Card` components - fyrir layout
- `formatCurrency()` - fyrir krónutölur
- `formatLifeEnergy()` - fyrir lífsorku texta
- `formatNumber()` - fyrir tölur
- `LoanAmortizationChart` (optional) - fyrir myndræna framsetningu

**Athugasemdir við innleiðingu**:
- Sýnir warning ef actualHourlyWage === 0
- Fyrir lán: Pie chart með kostnaðarsundurliðingu (lánsgreiðsla, fasteignagjöld, tryggingar, viðhald, etc.)
- Impactful messaging: "Yfir 25 ára lánstíma greiðir þú X kr í vexti - það er Y% af heildarkostnaði."
- Impactful messaging fyrir lífsorku: "Húsnæðiskostnaður þinn er X klukkustundir á mánuði - það er Y vinnudagar á ári!"
- FV calculations með 7% ávöxtun fyrir 5, 10, 20 ár
- Color coded sections: Kostnaður (primary), Lífsorka (warning), FV (success)

---

### HousingComparison

**Tilgangur**: Samanburður á 2-4 housing scenarios side-by-side

**Ábyrgð**:
- Sýna comparison table með helstu metrics fyrir allar scenarios
- Auðkenna ódýrasta og dýrasta valkostinn með litamerkingum
- Reikna og sýna sparnað milli valkosta
- Highlight key differences (kostnaður, lífsorka, FV, vaxtagreiðslur fyrir lán)
- Responsive design: Table á desktop, stacked cards á mobile

**Public Interface**:
```typescript
interface HousingComparisonProps {
  scenarios: HousingScenario[];
  actualHourlyWage: number;
  className?: string;
}
```

**Háðir (Dependencies)**:
- `Card` components
- `formatCurrency()`, `formatLifeEnergy()`, `formatNumber()`
- Comparison calculation functions

**Athugasemdir við innleiðingu**:
- Table columns: Heiti, Tegund (icon), Mánaðarkostnaður, Lífsorka/mán, FV (10 ár), Heildar vaxtagreiðslur (ef lán), Munur
- Litamerking: Grænt (best), Gult (middle), Rautt (worst)
- Sparnaðar message: "Með því að skipta úr [worst] í [best] sparar þú X kr og Y klst á mánuði, og Z kr eftir 10 ár"
- Responsive: Table -> Stacked cards á mobile
- Empty state: "Búðu til að minnsta kosti 2 sviðsmyndir til að bera saman"

---

### RentVsBuyAnalysis

**Tilgangur**: Sérstök greining fyrir leiga vs kaupa samanburð

**Ábyrgð**:
- Sýna mánaðarkostnað leiga vs kaupa hlið við hlið
- Reikna breakeven point (hversu mörg ár þar til kaupa er ódýrara)
- Sýna helstu kosti og galla leiga vs kaupa
- Sýna framtíðarvirði munanna ef fjárfest
- Taka tillit til fórnarkostnaðar innborgunar (down payment)

**Public Interface**:
```typescript
interface RentVsBuyAnalysisProps {
  rentalScenarios: HousingScenario[];
  ownedScenarios: HousingScenario[];
  actualHourlyWage: number;
  className?: string;
}
```

**Háðir (Dependencies)**:
- `Card` components
- `formatCurrency()`, `formatNumber()`
- Rent vs buy comparison functions

**Athugasemdir við innleiðingu**:
- Velur ódýrasta rental og ódýrasta owned scenario fyrir samanburð
- Sýnir mánaðarkostnað: Rental vs Owned
- Reiknar breakeven: Eftir hve mörg ár er kaupa ódýrara (miðað við eigið fé safnast vs leigu kostnaður)
- Sýnir pros/cons:
  - Leiga: Sveigjanleiki, lægri upphafskostnaður, enginn viðhaldskostnaður
  - Kaupa: Eigið fé safnast, langtímastöðugleiki, hægt að endurbæta
- Disclaimer: "Þessi greining miðast eingöngu við fjárhagslegan kostnað. Persónulegir þættir geta verið jafn mikilvægir."

---

### LoanAmortizationChart (Optional)

**Tilgangur**: Myndrænni framsetning á vöxtum og höfuðstóli yfir lánstíma

**Ábyrgð**:
- Sýna stacked area chart eða línurit með höfuðstóll vs vexti yfir tíma
- Highlight hversu mikið fer í vexti vs höfuðstól fyrstu árin
- Interactive tooltip með nákvæmum gildum

**Public Interface**:
```typescript
interface LoanAmortizationChartProps {
  loanDetails: LoanDetails;
  className?: string;
}
```

**Háðir (Dependencies)**:
- `Recharts` library (lightweight charting)
- `formatCurrency()`

**Athugasemdir við innleiðingu**:
- X-ás: Ár (0-lánstími)
- Y-ás: Krónutala
- Stacked area: Vaxtagreiðslur (rautt) stacked on top of höfuðstóllsgreiðslur (grænt)
- Responsive: Adjusts width miðað við container
- Optional component - can be left out of MVP

---

### CalculatorContext Extensions

**Tilgangur**: Víkka núverandi CalculatorContext til að styðja housing scenarios

**Nýir state þættir**:
```typescript
interface CalculatorContextType {
  // ... existing fields ...

  // Housing scenarios
  housingScenarios: HousingScenario[];
  addHousingScenario: (scenario: Omit<HousingScenario, 'id' | 'results'>) => void;
  updateHousingScenario: (id: string, updates: Partial<HousingScenario>) => void;
  deleteHousingScenario: (id: string) => void;
  duplicateHousingScenario: (id: string) => void;
}
```

**Nýjar ábyrgðir**:
- Geyma allt að 4 housing scenarios í state
- Keyra calculations fyrir hverja scenario með `calculateHousingResults()`
- Auto-save til localStorage með 500ms debounce
- Validate að ekki meira en 4 scenarios

**Háðir (Dependencies)**:
- `calculateHousingResults()` - calculation function
- `generateHousingId()` - ID generator
- localStorage

**Athugasemdir við innleiðingu**:
- Bætir `housingScenarios: HousingScenario[]` við `StoredState` interface
- `addHousingScenario` kastar error ef >= 4 scenarios
- `calculateHousingResults()` keyrir fyrir hverja scenario við save/update
- Scenarios hafa auto-generated IDs líkt og subscriptions og commute

---

## Gagnalíkön (Data Models)

### HousingScenario

**Eiginleikar**:
```typescript
interface HousingScenario {
  id: string; // Auto-generated unique ID
  name: string; // User-defined name, max 50 chars (e.g., "Núverandi íbúð", "Minni íbúð í Breiðholti")
  inputs: HousingInputs; // All input data
  results: HousingResults; // Calculated results
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
  isCurrent?: boolean; // Optional flag to mark "current housing"
}
```

**Validation Reglur**:
- `id`: Non-empty string, unique
- `name`: 1-50 characters, required
- `inputs`: Must pass HousingInputs validation
- `results`: Auto-calculated, cannot be manually set
- `createdAt`, `updatedAt`: Valid ISO 8601 dates

**Tengsl**:
- Belongs to user's scenario list (max 4)
- References actualHourlyWage from CalculatorContext for life energy calculations

**Geymsla**:
- Stored in CalculatorContext state
- Persisted in localStorage under `StoredState.housingScenarios`

---

### HousingInputs

**Eiginleikar**:
```typescript
type HousingType = 'rental' | 'owned_with_loan' | 'owned_paid_off';

interface HousingInputs {
  housingType: HousingType; // Required

  // Rental-specific (only if housingType === 'rental')
  rental?: RentalDetails;

  // Owned with loan-specific (only if housingType === 'owned_with_loan')
  loan?: LoanDetails;

  // Owned paid off-specific (only if housingType === 'owned_paid_off')
  ownedPaidOff?: OwnedPaidOffDetails;
}
```

**Validation Reglur**:
- `housingType`: Required, must be one of enum values
- Conditional validation: If rental, `rental` object required; if owned_with_loan, `loan` required; if owned_paid_off, `ownedPaidOff` required

**Tengsl**:
- Embedded in HousingScenario
- Used as input for calculateHousingResults()

**Geymsla**:
- Part of HousingScenario in localStorage

---

### RentalDetails

**Eiginleikar**:
```typescript
interface RentalDetails {
  monthlyRent: number; // ISK per month, required, > 0, max 1000000
  heatIncluded: boolean; // Default false
  electricityIncluded: boolean; // Default false
  monthlyHeatCost: number; // ISK, required if !heatIncluded, >= 0
  monthlyElectricityCost: number; // ISK, required if !electricityIncluded, >= 0
}
```

**Validation Reglur**:
- `monthlyRent`: Required, > 0, <= 1,000,000
- `heatIncluded`, `electricityIncluded`: Boolean
- `monthlyHeatCost`: Required if !heatIncluded, >= 0
- `monthlyElectricityCost`: Required if !electricityIncluded, >= 0

**Tengsl**:
- Optional property of HousingInputs (only when housingType === 'rental')

**Geymsla**:
- Part of HousingInputs

---

### LoanDetails

**Eiginleikar**:
```typescript
type LoanType = 'indexed' | 'non_indexed';

interface LoanDetails {
  loanType: LoanType; // Required
  totalLoanAmount: number; // ISK, required, > 0, max 500000000
  annualInterestRate: number; // %, required, > 0, max 20
  loanTermYears: number; // Years, required, 1-40

  // Indexed loan only
  annualInflationRate?: number; // %, required if loanType === 'indexed', > 0, max 20, default 3.5

  // Ownership costs (applies to both loan types)
  annualPropertyTax: number; // ISK, required, >= 0
  annualHomeInsurance: number; // ISK, required, >= 0
  annualMaintenanceCost: number; // ISK, required, >= 0
  monthlyHOAFees: number; // ISK, >= 0, default 0
  monthlyHeatCost: number; // ISK, required, >= 0
  monthlyElectricityCost: number; // ISK, required, >= 0
}
```

**Validation Reglur**:
- `loanType`: Required
- `totalLoanAmount`: Required, > 0, <= 500,000,000
- `annualInterestRate`: Required, > 0, <= 20
- `loanTermYears`: Required, 1-40, integer
- `annualInflationRate`: Required if `loanType === 'indexed'`, > 0, <= 20
- All cost fields: >= 0
- Defaults provided based on Icelandic averages

**Tengsl**:
- Optional property of HousingInputs (only when housingType === 'owned_with_loan')

**Geymsla**:
- Part of HousingInputs

---

### OwnedPaidOffDetails

**Eiginleikar**:
```typescript
interface OwnedPaidOffDetails {
  estimatedPropertyValue?: number; // ISK, optional, >= 0 (for opportunity cost)
  annualPropertyTax: number; // ISK, required, >= 0
  annualHomeInsurance: number; // ISK, required, >= 0
  annualMaintenanceCost: number; // ISK, required, >= 0
  monthlyHOAFees: number; // ISK, >= 0, default 0
  monthlyHeatCost: number; // ISK, required, >= 0
  monthlyElectricityCost: number; // ISK, required, >= 0
}
```

**Validation Reglur**:
- `estimatedPropertyValue`: Optional, >= 0
- All other fields: >= 0
- All required fields must be provided

**Tengsl**:
- Optional property of HousingInputs (only when housingType === 'owned_paid_off')

**Geymsla**:
- Part of HousingInputs

---

### HousingResults

**Eiginleikar**:
```typescript
interface HousingResults {
  // Cost breakdown
  monthlyHousingPayment: number; // Rent or loan payment
  monthlyPropertyTax: number; // annualPropertyTax / 12
  monthlyInsurance: number; // annualHomeInsurance / 12
  monthlyMaintenance: number; // annualMaintenanceCost / 12
  monthlyHOAFees: number;
  monthlyHeatCost: number;
  monthlyElectricityCost: number;
  totalMonthlyCost: number; // Sum of all above
  totalYearlyCost: number; // totalMonthlyCost * 12

  // Loan-specific (only if housingType === 'owned_with_loan')
  loanInfo?: {
    monthlyPayment: number; // Calculated loan payment
    totalPaymentsOverLife: number; // monthlyPayment * loanTermYears * 12
    totalInterestPaid: number; // totalPaymentsOverLife - totalLoanAmount
    interestPercentage: number; // (totalInterestPaid / totalPaymentsOverLife) * 100
  };

  // Life energy calculations
  lifeEnergyMonthlyHours: number; // totalMonthlyCost / actualHourlyWage
  lifeEnergyYearlyHours: number; // lifeEnergyMonthlyHours * 12
  lifeEnergyYearlyDays: number; // lifeEnergyYearlyHours / 24
  lifeEnergyYearlyWorkDays: number; // lifeEnergyYearlyHours / 8
  lifeEnergyYearlyWorkWeeks: number; // lifeEnergyYearlyHours / 40

  // FI Impact (future value if invested instead at 7% annual return)
  futureValue5Years: number;
  futureValue10Years: number;
  futureValue20Years: number;

  // Opportunity cost (only if owned_paid_off with estimatedPropertyValue)
  monthlyOpportunityCost?: number; // (estimatedPropertyValue * 0.07) / 12
}
```

**Validation Reglur**:
- All numeric values must be >= 0
- Results are calculated, not user-input
- If actualHourlyWage === 0, life energy values = 0

**Tengsl**:
- Calculated from HousingInputs + actualHourlyWage
- Embedded in HousingScenario

**Geymsla**:
- Part of HousingScenario in localStorage
- Recalculated whenever inputs or actualHourlyWage changes

---

### HousingType (Enum)

**Gildi**:
```typescript
type HousingType = 'rental' | 'owned_with_loan' | 'owned_paid_off';
```

**Íslenskar merkingar**:
```typescript
const HOUSING_TYPE_LABELS: Record<HousingType, string> = {
  rental: 'Leiguhúsnæði',
  owned_with_loan: 'Eignarhúsnæði með láni',
  owned_paid_off: 'Eignarhúsnæði greitt upp'
};
```

---

### LoanType (Enum)

**Gildi**:
```typescript
type LoanType = 'indexed' | 'non_indexed';
```

**Íslenskar merkingar**:
```typescript
const LOAN_TYPE_LABELS: Record<LoanType, string> = {
  indexed: 'Verðtryggt lán',
  non_indexed: 'Óverðtryggt lán'
};
```

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
  housingScenarios: HousingScenario[]; // NEW: Array of up to 4 housing scenarios
  lastUpdated: string;
}
```

**Validation Reglur**:
- `housingScenarios`: Array length <= 4
- Each scenario must pass HousingScenario validation

**Geymsla**:
- localStorage key: Same as existing (part of StoredState)
- Migrated when version changes

---

## Villustýring (Error Handling)

### Inntaksvillur (Input Validation Errors)

#### Grunnupplýsingar

**Heiti (name)**:
- Skilyrði: 1-50 stafir
- Villuskilaboð: "Heiti má ekki vera tómt" eða "Heiti má ekki vera lengra en 50 stafir"
- Endurhæfing: Sýnir error state, disable "Vista" takka
- Logging: Engin

**Húsnæðistegund (housingType)**:
- Skilyrði: Verður að vera 'rental', 'owned_with_loan', eða 'owned_paid_off'
- Villuskilaboð: "Veldu húsnæðistegund"
- Endurhæfing: Sýnir error, disable save
- Logging: Engin

#### Leiguhúsnæði

**Mánaðarleg leiga (monthlyRent)**:
- Skilyrði: > 0 og <= 1,000,000
- Villuskilaboð: "Mánaðarleg leiga verður að vera á milli 0 og 1.000.000 kr"
- Endurhæfing: Sýnir rauðan ramma, disable save
- Logging: Engin

**Hitakostnaður / Rafmagnskostnaður (ef ekki innifalið)**:
- Skilyrði: >= 0
- Villuskilaboð: "Kostnaður má ekki vera neikvæður"
- Endurhæfing: Sýnir error, disable save
- Logging: Engin

#### Lán

**Heildarupphæð láns (totalLoanAmount)**:
- Skilyrði: > 0 og <= 500,000,000
- Villuskilaboð: "Lánsupphæð verður að vera á milli 0 og 500.000.000 kr"
- Endurhæfing: Sýnir error, disable save
- Logging: Engin

**Ársvextir (annualInterestRate)**:
- Skilyrði: > 0 og <= 20
- Villuskilaboð: "Vextir verða að vera á milli 0% og 20%"
- Endurhæfing: Sýnir error, disable save
- Logging: Engin

**Lánstími (loanTermYears)**:
- Skilyrði: 1-40 ár, heiltala
- Villuskilaboð: "Lánstími verður að vera á milli 1 og 40 ár"
- Endurhæfing: Sýnir error, disable save
- Logging: Engin

**Verðbólga (annualInflationRate, fyrir verðtryggð lán)**:
- Skilyrði: > 0 og <= 20
- Villuskilaboð: "Verðbólga verður að vera á milli 0% og 20%"
- Endurhæfing: Sýnir error, disable save
- Logging: Engin

**Eignarhaldskostrnaður (fasteignagjöld, tryggingar, viðhald, etc.)**:
- Skilyrði: >= 0
- Villuskilaboð: "Kostnaður má ekki vera neikvæður"
- Endurhæfing: Sýnir error, disable save
- Logging: Engin

### Kerfivillur (System Errors)

#### Of margar sviðsmyndir

**Staða**: Notandi reynir að búa til 5. sviðsmynd
- Villuboð: "Þú getur aðeins haft 4 sviðsmyndir í einu. Eyddu einni til að búa til nýja."
- Birtist sem: Alert component með warning variant
- Endurhæfing: "Bæta við" takki er disabled þegar 4 scenarios eru til
- Logging: console.warn('Maximum housing scenarios reached')

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
- Logging: console.warn('Failed to parse stored housing scenarios', error)

### Útreikningsvillur (Calculation Errors)

#### Division by zero

**Staða**: actualHourlyWage === 0 við lífsorku útreikning
- Endurhæfing: life energy values = 0, engar villur
- Villuboð: Engin (handled gracefully)
- Logging: Engin

#### Mjög há gildi

**Staða**: Lán yfir 100.000.000 kr eða vextir yfir 15%
- Villuboð: Warning í UI "Þetta virðist mjög hátt - ertu viss um að þetta sé rétt?"
- Endurhæfing: Leyfa samt að vista (edge case support)
- Logging: console.warn('Unusually high value detected', field, value)

#### Mjög langur lánstími

**Staða**: Lánstími > 30 ár
- Villuboð: Warning "Athugið: Langur lánstími þýðir mun meiri vaxtagreiðslur."
- Endurhæfing: Leyfa samt, sýna extra warning
- Logging: Engin

### Validation Function Design

**validateHousingInputs()**:
```typescript
function validateHousingInputs(inputs: Partial<HousingInputs>): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  // Validate housingType
  if (!inputs.housingType) {
    errors.housingType = 'Veldu húsnæðistegund';
  }

  // Conditional validation based on housingType
  if (inputs.housingType === 'rental') {
    // Validate rental fields
  } else if (inputs.housingType === 'owned_with_loan') {
    // Validate loan fields
    // Nested conditional for indexed vs non_indexed
  } else if (inputs.housingType === 'owned_paid_off') {
    // Validate owned paid off fields
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
```

**Staðsetning**: /lib/validation/housing.ts

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

**Jaðartilvik 1: Verðtryggð lán með 0% verðbólgu**:
- Ábending: "Ef verðbólga er 0%, þá er verðtryggt lán í raun óverðtryggt. Íhugaðu að nota óverðtryggt lán í staðinn."

**Jaðartilvik 2: Leiga með allir kostnaðir innifaldir**:
- Validation: Ef hiti og rafmagn eru báðir innifaldir, þá eru þeir reitir hidden og 0

**Jaðartilvik 3: Eignarhúsnæði án eignarvirðis**:
- Fórnarkostnaður ekki reiknaður, enginn villuboð

**Jaðartilvik 4: Mjög stuttur lánstími (<5 ár)**:
- Warning en ekki error: "Athugið: Stuttur lánstími þýðir háar mánaðargreiðslur."

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

---

## Prófunarstefna (Testing Strategy)

### Unit Testing

**Calculation Functions** (`/lib/calculations/housing.ts`):

**Test Coverage Target**: 100% fyrir calculation functions

**Prófunarsvit fyrir calculateLoanPayment()**:
```typescript
describe('calculateLoanPayment', () => {
  describe('Non-indexed loans (standard amortization)', () => {
    it('calculates monthly payment correctly', () => {
      // Test: 40,000,000 kr, 5.5%, 25 years
      // Expected: ~245,000 kr/month
    });

    it('calculates total interest correctly', () => {
      // Test: Total payments - principal
    });

    it('calculates interest percentage correctly', () => {});
  });

  describe('Indexed loans (inflation-adjusted)', () => {
    it('calculates monthly payment with inflation', () => {
      // Test: 40,000,000 kr, 3.5% interest, 3.5% inflation, 25 years
      // Expected: ~254,000 kr/month (higher due to inflation)
    });

    it('handles different inflation rates', () => {});
  });

  describe('Edge cases', () => {
    it('handles very short loan terms (1 year)', () => {});
    it('handles very long loan terms (40 years)', () => {});
    it('handles very high interest rates (15%)', () => {});
    it('handles 0% inflation for indexed loans', () => {});
  });
});
```

**Prófunarsvit fyrir calculateHousingResults()**:
```typescript
describe('calculateHousingResults', () => {
  describe('Rental housing calculations', () => {
    it('calculates rental costs correctly', () => {
      // Test: Rent + heat + electricity
    });

    it('handles included utilities correctly', () => {
      // Test: Heat/electricity included flags
    });
  });

  describe('Owned with loan calculations', () => {
    it('calculates all monthly costs correctly', () => {
      // Test: Loan + property tax + insurance + maintenance + HOA + heat + electricity
    });

    it('includes loan info in results', () => {
      // Test: loanInfo object present and correct
    });
  });

  describe('Owned paid off calculations', () => {
    it('calculates costs without loan', () => {
      // Test: Property tax + insurance + maintenance + HOA + heat + electricity
    });

    it('calculates opportunity cost when property value provided', () => {
      // Test: (propertyValue * 0.07) / 12
    });

    it('skips opportunity cost when property value not provided', () => {});
  });

  describe('Life energy calculations', () => {
    it('calculates life energy correctly', () => {
      // Test: Monthly cost / actualHourlyWage
    });

    it('returns 0 when actualHourlyWage is 0', () => {});

    it('converts to days, work days, work weeks correctly', () => {});
  });

  describe('Future value calculations', () => {
    it('calculates FV for 5, 10, 20 years correctly', () => {
      // Test: Monthly cost invested at 7% annual return
    });

    it('handles 0 monthly cost correctly', () => {});
  });
});
```

**Verkfæri**: Vitest (matches existing app stack)
**Staðsetning**: `/lib/calculations/__tests__/housing.test.ts`

---

### Component Testing

**React Components** - Integration testing fyrir UI logic

**Test Coverage Target**: 80%+ fyrir components

**HousingForm Tests**:
```typescript
describe('HousingForm', () => {
  describe('Rendering', () => {
    it('renders housing type selector', () => {});
    it('shows rental fields when rental selected', () => {});
    it('shows loan fields when owned_with_loan selected', () => {});
    it('shows owned paid off fields when owned_paid_off selected', () => {});
    it('shows indexed/non-indexed selector for loans', () => {});
    it('shows inflation field for indexed loans only', () => {});
  });

  describe('Conditional rendering', () => {
    it('hides heat cost when heat included', () => {});
    it('hides electricity cost when electricity included', () => {});
    it('shows all ownership costs for loans', () => {});
  });

  describe('Validation', () => {
    it('shows error for invalid rent amount', () => {});
    it('shows error for invalid loan amount', () => {});
    it('shows error for invalid interest rate', () => {});
    it('shows error for invalid loan term', () => {});
    it('disables save button when invalid', () => {});
    it('enables save when all fields valid', () => {});
  });

  describe('Form submission', () => {
    it('calls onSave with correct rental data', () => {});
    it('calls onSave with correct loan data', () => {});
    it('calls onSave with correct paid off data', () => {});
    it('calls onCancel when cancel clicked', () => {});
  });
});
```

**HousingSummary Tests**:
```typescript
describe('HousingSummary', () => {
  it('displays monthly and yearly cost correctly', () => {});
  it('displays cost breakdown for rental', () => {});
  it('displays cost breakdown for loan', () => {});
  it('displays loan info when applicable', () => {});
  it('displays life energy when wage available', () => {});
  it('hides life energy when wage is 0', () => {});
  it('displays future value calculations', () => {});
  it('shows warning for indexed loans', () => {});
  it('shows warning for high interest percentages', () => {});
  it('displays opportunity cost for paid off with value', () => {});
});
```

**HousingComparison Tests**:
```typescript
describe('HousingComparison', () => {
  it('renders comparison table with 2 scenarios', () => {});
  it('identifies cheapest scenario correctly', () => {});
  it('identifies most expensive scenario correctly', () => {});
  it('calculates savings correctly', () => {});
  it('shows empty state with < 2 scenarios', () => {});
  it('renders mobile view correctly', () => {});
  it('displays loan info column for scenarios with loans', () => {});
});
```

**RentVsBuyAnalysis Tests**:
```typescript
describe('RentVsBuyAnalysis', () => {
  it('renders when rental and owned scenarios present', () => {});
  it('calculates monthly cost difference', () => {});
  it('calculates breakeven point', () => {});
  it('displays pros and cons lists', () => {});
  it('shows future value of difference', () => {});
  it('displays disclaimer about non-financial factors', () => {});
});
```

**HousingCalculator Tests**:
```typescript
describe('HousingCalculator', () => {
  it('renders list of scenarios', () => {});
  it('allows adding new scenario', () => {});
  it('disables add button at 4 scenarios', () => {});
  it('allows deleting scenario with confirmation', () => {});
  it('switches between scenario and comparison view', () => {});
  it('shows warning when actualHourlyWage missing', () => {});
  it('triggers RentVsBuyAnalysis when applicable', () => {});
});
```

**Verkfæri**: React Testing Library + Vitest
**Staðsetning**: `/components/housing/__tests__/`

---

### Integration Testing

**CalculatorContext Integration**:
```typescript
describe('CalculatorContext with Housing', () => {
  it('adds housing scenario to state', () => {});
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
**Staðsetning**: `/context/__tests__/CalculatorContext.housing.test.ts`

---

### End-to-End Testing

**Critical User Flows**:

**Flow 1: Create first rental scenario**:
1. Navigate to housing calculator
2. Click "Bæta við sviðsmynd"
3. Select "Leiguhúsnæði"
4. Fill in rent, heat included, electricity included
5. Click "Vista"
6. Verify scenario appears in list
7. Verify results displayed correctly

**Flow 2: Create owned with loan scenario (indexed)**:
1. Click "Bæta við sviðsmynd"
2. Select "Eignarhúsnæði með láni"
3. Select "Verðtryggt lán"
4. Fill in loan details and ownership costs
5. Click "Vista"
6. Verify loan info displayed correctly
7. Verify inflation warning shown

**Flow 3: Compare rental vs owned**:
1. Create rental scenario
2. Create owned with loan scenario
3. Click "Samanburður" tab
4. Verify comparison table shows both
5. Verify cheapest is highlighted green
6. Verify RentVsBuyAnalysis appears
7. Verify breakeven calculation shown

**Flow 4: Edit existing scenario**:
1. Create scenario
2. Click edit icon
3. Change loan amount or interest rate
4. Click Vista
5. Verify results updated correctly
6. Verify loan info recalculated

**Flow 5: Delete scenario**:
1. Create scenario
2. Click delete icon
3. Confirm deletion
4. Verify scenario removed

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
    const { container } = render(<HousingCalculator />);
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
    calculateHousingResults(inputs, wage);
    const end = performance.now();
    expect(end - start).toBeLessThan(50);
  });

  it('handles 4 scenarios without lag', () => {
    // Render 4 scenarios
    // Measure render time
  });

  it('calculates loan amortization quickly', () => {
    // Measure loan calculation time
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
- [ ] actualHourlyWage = 0
- [ ] Very high loan (>100,000,000 kr)
- [ ] Very high interest rate (>10%)
- [ ] Very long loan term (>30 years)
- [ ] 0% inflation for indexed loan
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

## Rekjanleiki Krafna (Requirements Traceability)

Þessi hluti tengir hönnunarþætti við upprunalegar kröfur úr requirements.md skjalinu.

### NS-1: Skrá upplýsingar um húsnæðiskostnað

**Hönnunarþættir sem uppfylla þessa kröfu**:

**Arkitektúr**:
- HousingForm component með dynamic field rendering
- Conditional validation miðað við húsnæðistegund
- CalculatorContext auto-save með 500ms debounce

**Íhlutir**:
- `HousingForm`: Input fields fyrir alla nauðsynlega reiti
  - Step 1: Val á húsnæðistegund
  - Conditional fields: rental, owned_with_loan (með indexed/non-indexed), owned_paid_off
  - Nested conditionals: hiti/rafmagn innifalið fyrir rental

**Gagnalíkön**:
- `HousingInputs`: Conditional structure með rental/loan/ownedPaidOff details
- `RentalDetails`: Leiga, hiti innifalinn, rafmagn innifalið, kostnaður
- `LoanDetails`: Lánstegund, lánsupplýsingar, eignarhaldskorstnaður
- `OwnedPaidOffDetails`: Eignarvirði (valfrjálst), eignarhaldskorstnaður

**Validation**:
- `validateHousingInputs()`: Real-time validation á öllum reitum
- Conditional validation miðað við húsnæðistegund og lánstegund

**Prófun**:
- Unit tests fyrir validation logic
- Component tests fyrir conditional rendering
- E2E test fyrir "Create first scenario" flow

**Samþykktarviðmið**:
- ✓ NS-1.1: Val á húsnæðistegund
- ✓ NS-1.2: Rental reiti sýndir þegar leiguhúsnæði valið
- ✓ NS-1.3: Loan reiti sýndir þegar eignarhúsnæði með láni valið (með lánstegund val)
- ✓ NS-1.4: Owned paid off reiti sýndir
- ✓ NS-1.5: Real-time updates við input breytingar
- ✓ NS-1.6: localStorage geymsla
- ✓ NS-1.7: Allt að 4 sviðsmyndir studdar
- ✓ NS-1.8: Heiti á sviðsmynd

---

### NS-2: Sjá raunverulegan mánaðarlegan og árlegan kostnað

**Hönnunarþættir**:

**Arkitektúr**:
- Calculation functions í `/lib/calculations/housing.ts`
- Reuse af `calculateFutureValue()` úr subscriptions og commute

**Íhlutir**:
- `HousingSummary`: Displays all cost breakdowns
- Cost breakdown með pie chart fyrir owned scenarios

**Gagnalíkön**:
- `HousingResults`: monthlyHousingPayment, monthlyPropertyTax, monthlyInsurance, monthlyMaintenance, monthlyHOAFees, monthlyHeatCost, monthlyElectricityCost, totalMonthlyCost, totalYearlyCost
- `loanInfo`: monthlyPayment, totalPaymentsOverLife, totalInterestPaid, interestPercentage

**Útreikningar**:
- Rental: Leiga + hiti (ef ekki innifalið) + rafmagn (ef ekki innifalið)
- Loan: calculateLoanPayment() + fasteignagjöld/12 + tryggingar/12 + viðhald/12 + félagsgjöld + hiti + rafmagn
- Owned paid off: fasteignagjöld/12 + tryggingar/12 + viðhald/12 + félagsgjöld + hiti + rafmagn
- Loan details: Total interest, interest percentage

**Prófun**:
- Unit tests fyrir alla cost calculations
- Unit tests fyrir loan calculations (indexed og non-indexed)
- Component tests fyrir cost display

**Samþykktarviðmið**:
- ✓ NS-2.1: Sýnir heildar mánaðar- og árskostnað með sundurliðun
- ✓ NS-2.2: Sýnir loan info fyrir lán (mánaðargreiðsla, heildar vaxtagreiðslur, hlutfall vaxta)
- ✓ NS-2.3: Sundurliðun á öllum kostnaðarliðum
- ✓ NS-2.4: Samanburður á "það sem fólk hugsar um" vs "raunverulegur kostnaður"
- ✓ NS-2.5: Ábending um vaxtagreiðslur fyrir lán
- ✓ NS-2.6: Ábending um verðtryggð lán

---

### NS-3: Sjá lífsorku kostnað

**Hönnunarþættir**:

**Arkitektúr**:
- Integration með CalculatorContext fyrir actualHourlyWage
- Reuse af `dollarsToLifeEnergy()` og `formatLifeEnergy()` functions

**Íhlutir**:
- `HousingSummary`: Life energy section með impactful messaging
- Alert ef actualHourlyWage vantar með link að aðalreiknivél

**Gagnalíkön**:
- `HousingResults.lifeEnergyMonthlyHours`: Monthly cost / actualHourlyWage
- `HousingResults.lifeEnergyYearlyHours`, `lifeEnergyYearlyDays`, `lifeEnergyYearlyWorkDays`, `lifeEnergyYearlyWorkWeeks`

**Útreikningar**:
- Monthly hours: totalMonthlyCost / actualHourlyWage
- Yearly hours: monthly * 12
- Yearly days: yearly hours / 24
- Work days: yearly hours / 8
- Work weeks: yearly hours / 40

**Villustýring**:
- Division by zero handling ef actualHourlyWage === 0
- Warning message ef actualHourlyWage vantar

**Prófun**:
- Unit tests fyrir life energy calculations
- Component tests fyrir conditional display
- Edge case test: actualHourlyWage = 0

**Samþykktarviðmið**:
- ✓ NS-3.1: Sýnir mánaðar- og árskostnað sem lífsorku (klst, dagar, vinnudagar, vinnuvikur)
- ✓ NS-3.2: Impactful messaging um lífsorku tap
- ✓ NS-3.3: Sýnir skilaboð ef actualHourlyWage vantar
- ✓ NS-3.4: Notar actualHourlyWage (ekki nafnverð)
- ✓ NS-3.5: Ábending þegar lífsorka er há (>160 klst/mánuði)

---

### NS-4: Sjá áhrif á fjárhagslegt frelsi (FI)

**Hönnunarþættir**:

**Arkitektúr**:
- Reuse af `calculateFutureValue()` function (7% ávöxtun)

**Íhlutir**:
- `HousingSummary`: Future value section með color-coded cards

**Gagnalíkön**:
- `HousingResults.futureValue5Years`, `futureValue10Years`, `futureValue20Years`

**Útreikningar**:
- FV = monthlyCost * ((1 + r)^n - 1) / r
- r = 0.07/12 (monthly rate)
- n = years * 12

**Prófun**:
- Unit tests fyrir FV calculations með þekktum gildum
- Component tests fyrir FV display

**Samþykktarviðmið**:
- ✓ NS-4.1: Sýnir framtíðarvirði fyrir 5, 10, 20 ár
- ✓ NS-4.2: Fyrir lán: Sýnir framtíðarvirði lánsgreiðslu og eingöngu vaxtagreiðslna
- ✓ NS-4.3: Impactful messaging um fórnarkostnað
- ✓ NS-4.4: Sýnir hlutfall af FI markmiði (ef þekkt)
- ✓ NS-4.5: Ábending fyrir leiguhúsnæði
- ✓ NS-4.6: Ábending fyrir eignarhúsnæði

---

### NS-5: Bera saman húsnæðisvalkosti

**Hönnunarþættir**:

**Arkitektúr**:
- CalculatorContext manages multiple scenarios (max 4)
- Comparison calculations

**Íhlutir**:
- `HousingCalculator`: Toggle milli "Scenarios" og "Samanburður" views
- `HousingComparison`: Side-by-side comparison table
  - Responsive: table á desktop, stacked cards á mobile
  - Color coding: grænt (best), rautt (worst), gult (middle)

**Gagnalíkön**:
- `HousingScenario[]`: List of up to 4 scenarios
- `isCurrent` flag fyrir að merkja núverandi húsnæði

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
- ✓ NS-5.7: Sýnir vaxtagreiðslur fyrir lán í samanburði

---

### NS-6: Leiga vs kaupa greining

**Hönnunarþættir**:

**Arkitektúr**:
- Dedicated RentVsBuyAnalysis component
- Triggered þegar >= 1 rental og >= 1 owned_with_loan scenario

**Íhlutir**:
- `RentVsBuyAnalysis`: Sérstök greining fyrir rent vs buy
  - Monthly cost comparison
  - Breakeven calculation
  - Pros/cons lists
  - Future value of differences
  - Disclaimer

**Gagnalíkön**:
- Uses existing HousingScenario data
- Comparison calculations

**Útreikningar**:
- Monthly cost difference: owned - rental
- Breakeven: When accumulated equity > accumulated rent + opportunity cost
- Future value of difference if invested

**Prófun**:
- Component tests fyrir rent vs buy logic
- Breakeven calculation tests
- E2E test fyrir rent vs buy comparison flow

**Samþykktarviðmið**:
- ✓ NS-6.1: Triggeras þegar rental og owned scenarios til samanburðar
- ✓ NS-6.2: Sýnir mánaðarkostnað samanburð
- ✓ NS-6.3: Sýnir breakeven point
- ✓ NS-6.4: Sýnir helstu kosti og galla
- ✓ NS-6.5: Ábending um persónulega þætti

---

### NS-7: Endurfjármögnun (refinance) greining

**Hönnunarþættir**:

**Arkitektúr**:
- Logic í comparison component
- Detected þegar 2 owned_with_loan scenarios með mismunandi vöxtum/lánstíma

**Íhlutir**:
- `HousingComparison`: Sérstakir reitir fyrir refinance greining þegar við á

**Gagnalíkön**:
- Uses existing HousingScenario data
- Refinance-specific calculations

**Útreikningar**:
- Monthly savings: current payment - new payment
- Total interest savings: current total interest - new total interest
- Refinance cost (user input)
- Breakeven: refinance cost / monthly savings

**Prófun**:
- Unit tests fyrir refinance calculations
- Component tests fyrir refinance display

**Samþykktarviðmið**:
- ✓ NS-7.1: Detected þegar 2 lán sviðsmyndir með mismunandi vöxtum
- ✓ NS-7.2: Sýnir núverandi vs nýtt lán samanburð
- ✓ NS-7.3: Leyfa notanda að skrá kostnað við endurfjármögnun
- ✓ NS-7.4: Sýnir hvort endurfjármögnun borgi sig
- ✓ NS-7.5: Ábending ef kostnaður við endurfjármögnun er hár

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
- ✓ Ábending um verðtryggð lán (HousingSummary component)
- ✓ Ábending um háa vexti (HousingSummary component)

**Persónuvernd og gagnageymsla**:
- ✓ localStorage only (Arkitektúr)
- ✓ Engin netbeiðnir (Client-side design)
- ✓ localStorage lykill: `StoredState.housingScenarios` (Data model)
- ✓ Export/Import support (CalculatorContext integration)
- ✓ Max 4 sviðsmyndir (Validation)
- ✓ localStorage quota error handling (Error handling)

**Samhæfni**:
- ✓ Chrome/Edge/Firefox/Safari (síðustu 2 útgáfur) (Manual testing checklist)
- ✓ Responsive: Desktop/Tablet/Mobile (Component design)
- ✓ Stacked layout á mobile (HousingComparison responsive design)
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
- ✓ Engin Þjóðskrá/fasteignamat integration (Manual input)
- ✓ Einfölduð lánaformúla (Simplified indexed loan calculation)
- ✓ Allur texti á íslensku (All components)

**Forsendur uppfylltar**:
- ✓ actualHourlyWage frá aðalreiknivél (CalculatorContext integration)
- ✓ Notandi þekkir leigu eða lánsupplýsingar (Input requirement)
- ✓ Notandi þekkir eignarhaldskorstnaður (Input requirement with defaults)
- ✓ 7% ávöxtun standard (FI calculations)
- ✓ Íslensk meðaltöl fyrir eignarhaldskorstnaður (Default values)

---

### Árangursviðmið

Hönnunin uppfyllir öll árangursviðmið:

- ✓ Hægt að skrá húsnæði innan 3 mínútur (Simple form, conditional fields)
- ✓ Skýr munur á "augljósum kostnaði" vs "heildar kostnaði" (Cost breakdown display)
- ✓ Skilningur á lífsorku kostnaði (Life energy section með impactful messaging)
- ✓ Samanburður á allt að 4 valkostum (HousingComparison component)
- ✓ Áhrif vaxta og lánstíma sýnilegt (Loan info in results)
- ✓ Skilningur á fórnarkostnaði (FV calculations, opportunity cost for paid off)
- ✓ Nákvæmir útreikningar (Unit tests 100% coverage)
- ✓ Skýr framsetning (HousingSummary með structured display)
- ✓ localStorage persistence (CalculatorContext auto-save)
- ✓ Leiga vs kaupa samanburður (RentVsBuyAnalysis component)

---

### Tengsl við aðra eiginleika

**Krefst**:
- ✓ Raunverulegt Tímakaup reiknivél fyrir actualHourlyWage (CalculatorContext integration)

**Notar**:
- ✓ Sömu UI íhlutir (Card, Input, Select, Button, Alert, Checkbox)
- ✓ Sömu utility functions (formatCurrency, formatLifeEnergy, formatNumber, etc.)
- ✓ Sömu calculation patterns (calculateFutureValue, dollarsToLifeEnergy)

**Geymt með**:
- ✓ Aðalgögnum í localStorage (StoredState víkkun)

**Hluti af**:
- ✓ "Áhrif Útgjalda" (Expense Impact) flipanum í Phase 2 (Context integration)
