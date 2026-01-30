# Hönnunarskjal: Umönnunar- og Menntakostnaðarreiknivél

## Yfirlit

**Eiginleiki**: Umönnunar- og Menntakostnaðarreiknivél (Childcare & Education Cost Calculator)
**Forrit**: peninganaedalifid.is
**Kröfuskjal**: [requirements.md](./requirements.md)

### Samantekt

Umönnunar- og Menntakostnaðarreiknivélin hjálpar foreldrum að sjá raunverulegan kostnað við uppeldi barna - ekki bara í krónum, heldur í **lífsorku** (klukkustundum af vinnu) og áhrifum á **fjárhagslegt frelsi**.

Eiginleikinn nær yfir allan kostnaðinn frá leikskóla til háskóla:
- **Leikskóli**: 30.000-60.000 kr/mán eftir tegund
- **Frístund**: 25.000 kr/mán (9-12 mánuðir)
- **Tónlistarskóli/Tímar**: 10.000-15.000 kr/mán
- **Einkakennsla**: 8.000 kr/klst
- **Háskólasparnaður**: Framtíðaráætlun

### Kjarnaforsendur

1. **Client-only arkitektúr**: Engar netbeiðnir, öll gögn í localStorage
2. **Samþætting með aðalreiknivél**: Notar sama Context og `actualHourlyWage`
3. **Íslenskt samhengi**: Raunveruleg verð fyrir leikskóla, frístund, tónlistarskóla
4. **Fjölbarna stuðningur**: Auðvelt að skrá kostnað fyrir mörg börn
5. **Sviðsmyndasamanburður**: Notendur geta borið saman valkosti

### Lykilíhlutir

- **ChildcareEducationCalculator**: Aðal reiknivél með heildaryfirlit
- **DaycareSection**: Leikskólakostnaður með tegundavali
- **AfterSchoolSection**: Frístundarkostnaður með sumarmánuði
- **ActivitiesSection**: Tónlistarskóli og tímar með mörgum börnum
- **TutoringSection**: Einkakennsla með tímafjölda
- **UniversitySection**: Háskólasparnaður með framtíðarútreikningum
- **CategoryBreakdown**: Sundurliðun eftir flokkum
- **ScenarioComparison**: Samanburður sviðsmynda

### Tæknistafl

- **React** + **TypeScript**: Fyrir UI íhluti með tegundaöryggi
- **Context API**: Sameiginleg stöðustjórnun með aðalreiknivél
- **localStorage**: Vistun gagna (engin backend)
- **Tailwind CSS**: Samræmd stílsetning
- **useMemo**: Rauntíma útreikningar án endurútreiknings

### Lykilútreikningar

```typescript
// Mánaðarkostnaður (meðaltal)
monthlyAverage = yearlyTotal / 12

// Lífsorka kostnaður
lifeEnergyHours = monthlyCost / actualHourlyWage

// Háskólasparnaður (Future Value)
monthlyPayment = totalCost / (((1 + r)^n - 1) / r)
// þar sem r = monthlyReturn, n = monthsUntilCollege
```

### Hönnunarákvarðanir

Sex meginákvarðanir mótuðu hönnunina:

1. **Samþætting í CalculatorContext** (ekki aðskilinn Context)
2. **5 flokkar kostnaðar** (leikskóli, frístund, tímar, einkakennsla, háskóli)
3. **Fjölbarna stuðningur** með einföldum margföldurum
4. **Forstillingar fyrir íslenskt samhengi** (harðkóðuð verð)
5. **Sviðsmyndastuðningur** fyrir samanburð
6. **Háskólasparnaður með FV formúlu** (5% sjálfgefið)

### Staða útfærslu

**Þegar útfært**:
- TypeScript tegundir
- Útreikningsföll
- Context uppfærður

**Eftirstöðvar útfærslu**:
- UI íhlutir (8 íhlutir að búa til)
- Staðfestingar
- Villumeðhöndlun
- Prófanir

## Arkitektúr

### Yfirlit kerfis

Umönnunar- og Menntakostnaðarreiknivélin er samþættur eiginleiki sem byggir á núverandi Raunverulega Tímakaups reiknivélinni. Hann notar `actualHourlyWage` gildið til að umbreyta kostnaði í lífsorku (klukkustundir).

**Kjarnaregla**: Öll gögn eru geymd á viðmótshlið (client-side) í localStorage, engar netbeiðnir eru gerðar. Þetta tryggir persónuvernd og er í samræmi við aðalreiknivélina.

### Arkitektúr íhluta

```
┌─────────────────────────────────────────────────────────────────┐
│                         Vafri (Browser)                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                React Forrit (Application)                  │  │
│  │                                                            │  │
│  │  ┌──────────────────────────────────────────────────────┐ │  │
│  │  │           CalculatorContext (Sameiginlegt)           │ │  │
│  │  │  - Tekjuinnsláttur                                   │ │  │
│  │  │  - Útreikningur á actualHourlyWage                   │ │  │
│  │  │  - Umönnunar-/menntakostnaður (childcareItems[])     │ │  │
│  │  │  - localStorage stjórnun                             │ │  │
│  │  └────────────────┬─────────────────────────────────────┘ │  │
│  │                   │                                        │  │
│  │  ┌────────────────┼────────────────────────────────────┐  │  │
│  │  │                │                                     │  │  │
│  │  │  ┌─────────────▼──────────┐  ┌──────────────────┐   │  │  │
│  │  │  │ Aðalreiknivél          │  │ Umönnunarreiknivél│  │  │  │
│  │  │  │ (Wage Calculator)      │  │                  │   │  │  │
│  │  │  │                        │  │                  │   │  │  │
│  │  │  │ - Tekjuinnsláttur      │  │ - Leikskóli      │   │  │  │
│  │  │  │ - Kostnaðarinnsláttur  │  │ - Frístund       │   │  │  │
│  │  │  │ - actualHourlyWage ────┼─▶│ - Tímar          │   │  │  │
│  │  │  └────────────────────────┘  │ - Einkakennsla   │   │  │  │
│  │  │                               │ - Háskóli        │   │  │  │
│  │  │                               │ - Lífsorka       │   │  │  │
│  │  │                               └──────────────────┘   │  │  │
│  │  │                                                       │  │  │
│  │  │  ┌────────────────────────────────────────────────┐  │  │  │
│  │  │  │         Útreikningavél (Calculations)          │  │  │  │
│  │  │  │  - childcare.ts (nýtt)                         │  │  │  │
│  │  │  │    * calculateChildcareSummary()               │  │  │  │
│  │  │  │    * calculateUniversitySavings()              │  │  │  │
│  │  │  │  - lifeEnergy.ts (núverandi)                   │  │  │  │
│  │  │  │    * dollarsToLifeEnergy()                     │  │  │  │
│  │  │  └────────────────────────────────────────────────┘  │  │  │
│  │  │                                                       │  │  │
│  │  │  ┌────────────────────────────────────────────────┐  │  │  │
│  │  │  │      Gagnalög (Data Layer)                     │  │  │  │
│  │  │  │  - localStorage með ChildcareItem[]            │  │  │  │
│  │  │  │  - JSON export/import (með umönnunargögnum)    │  │  │  │
│  │  │  └────────────────────────────────────────────────┘  │  │  │
│  │  └───────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Gagnaflæði

1. **Notandi skráir tekjur** í aðalreiknivélina → `actualHourlyWage` er reiknað
2. **Notandi bætir við kostnaðarlið** → Viðbót við `childcareItems[]` array í Context
3. **Útreikningur keyrir sjálfkrafa** (useMemo):
   - Samtala kostnaðarliða → `totalMonthly`, `totalYearly`
   - Lífsorka → `lifeEnergyHoursPerMonth/Year` (notar `actualHourlyWage`)
   - Flokkasundurliðun → `byCategory[]` (raðað eftir kostnaði)
   - Háskólasparnaður → `universitySavings` (FV formúla)
4. **Niðurstöður birtast** í rauntíma í ChildcareEducationCalculator íhlutinum
5. **Gögn vistuð** sjálfkrafa í localStorage (debounced 500ms)

### Samþættingarpunktar

**Með Raunverulegu Tímakaups reiknivélinni**:
- Deilir sama `CalculatorContext`
- Notar `results.actualHourlyWage` fyrir lífsorku útreikninga
- Ef `actualHourlyWage` er 0 eða undefined → sýna skilaboð um að fylla út aðalreiknivélina fyrst

**Með localStorage**:
- Bætt við `childcareItems: ChildcareItem[]` í `StoredState`
- Flyst með export/import virkni
- Sama útgáfustjórnun (version number)

**Með FI Number Builder** (valfrjálst):
- Ef FI gögn til staðar → sýna áhrif á FI dagsetning
- Sviðsmyndasamanburður sýnir FI áhrif

### Tæknival

**Núverandi tækni (endurnýtt)**:
- **React**: Fyrir UI íhluti
- **TypeScript**: Fyrir tegundaöryggi
- **Context API**: Fyrir stjórnun á stöðu
- **localStorage**: Fyrir geymslu gagna
- **Tailwind CSS**: Fyrir stílsetningu

**Ný virkni**:
- **Future Value útreikningur**: Fyrir háskólasparnað
- **Flokkakerfi**: 5 flokkar fyrir umönnunar-/menntakostnað
- **Fjölbarna stuðningur**: Margföldun með fjölda barna

**Ákvörðun**: Engin ytri söfn fyrir útreikninga (halda einfaldleika og bundle stærð lítilli).

### Möppubygging

```
apps/peninganaedalifid/
├── src/
│   ├── app/
│   │   └── page.tsx                     # Aðalsíða með öllum reiknivélum
│   │
│   ├── components/
│   │   ├── calculator/                  # Núverandi íhlutir
│   │   │   └── ...
│   │   │
│   │   └── childcare/                   # NÝTT: Umönnunar íhlutir
│   │       ├── ChildcareEducationCalculator.tsx   # Aðal íhlutur
│   │       ├── DaycareSection.tsx                 # Leikskóli
│   │       ├── AfterSchoolSection.tsx             # Frístund
│   │       ├── ActivitiesSection.tsx              # Tímar
│   │       ├── TutoringSection.tsx                # Einkakennsla
│   │       ├── UniversitySection.tsx              # Háskóli
│   │       ├── CategoryBreakdown.tsx              # Sundurliðun
│   │       ├── ScenarioComparison.tsx             # Samanburður
│   │       └── ChildcareItemForm.tsx              # Eyðublað
│   │
│   ├── lib/
│   │   ├── calculations/
│   │   │   ├── childcare.ts            # NÝTT
│   │   │   ├── lifeEnergy.ts          # Núverandi (endurnýtt)
│   │   │   └── ...
│   │   │
│   │   └── utils/
│   │       └── formatters.ts           # Bæta við ISK formöttun
│   │
│   ├── context/
│   │   └── CalculatorContext.tsx       # UPPFÆRT með umönnunargögnum
│   │
│   └── types/
│       └── calculator.ts               # UPPFÆRT með umönnunartegundum
│
└── ...
```

## Íhlutir og viðmót

### Síðuútlit

**Desktop útlit (> 768px)**:

```
┌─────────────────────────────────────────────────────────────────┐
│  Haus (Header)                                      [Flytja út] │
│  peninganaedalifid.is - Lífsorku reiknivél                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Raunverulega Tímakaups Reiknivél                        │   │
│  │  [Núverandi reiknivél]                                   │   │
│  │  → Skilar actualHourlyWage: 2.500 kr/klst               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  UMÖNNUNAR- OG MENNTAKOSTNAÐUR                           │   │
│  │                                                           │   │
│  │  ┌───────────────────────────────────────────────────┐   │   │
│  │  │  Heildaryfirlit                                    │   │   │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌───────────┐  │   │   │
│  │  │  │ Á mánuði    │  │ Á ári       │  │ Lífsorka  │  │   │   │
│  │  │  │ 85.000 kr   │  │ 1.020.000 kr│  │ 34 klst/m │  │   │   │
│  │  │  │             │  │             │  │ 408 klst/á│  │   │   │
│  │  │  └─────────────┘  └─────────────┘  └───────────┘  │   │   │
│  │  └───────────────────────────────────────────────────┘   │   │
│  │                                                           │   │
│  │  ┌───────────────────────────────────────────────────┐   │   │
│  │  │  Leikskóli                                         │   │   │
│  │  │  Tegund: [Sveitarfélag ▼]  Fjöldi barna: [2]     │   │   │
│  │  │  Kostnaður: 30.000 kr/mán × 2 = 60.000 kr/mán    │   │   │
│  │  └───────────────────────────────────────────────────┘   │   │
│  │                                                           │   │
│  │  ┌───────────────────────────────────────────────────┐   │   │
│  │  │  Frístund                                          │   │   │
│  │  │  Fjöldi barna: [1]  Kostnaður/barn: 25.000 kr    │   │   │
│  │  │  ☐ Sumarmánuðir virkir                           │   │   │
│  │  │  Heildar: 25.000 kr/mán (9 mánuðir)              │   │   │
│  │  └───────────────────────────────────────────────────┘   │   │
│  │                                                           │   │
│  │  ┌───────────────────────────────────────────────────┐   │   │
│  │  │  Tónlistarskóli og tímar                          │   │   │
│  │  │  [Bæta við tímum] [Flýtival ▼]                   │   │   │
│  │  │                                                    │   │   │
│  │  │  • Píanótímar - 15.000 kr/mán (9 mán) - 2 börn   │   │   │
│  │  │  • Fótbolti - 10.000 kr/mán (10 mán) - 1 barn    │   │   │
│  │  └───────────────────────────────────────────────────┘   │   │
│  │                                                           │   │
│  │  [Einkakennsla] [Háskólasparnaður]                       │   │
│  │                                                           │   │
│  │  ┌───────────────────────────────────────────────────┐   │   │
│  │  │  Sundurliðun eftir flokkum                        │   │   │
│  │  │                                                    │   │   │
│  │  │  Leikskóli (1 lið)         60.000 kr    70.6%    │   │   │
│  │  │  ████████████████████░░░░░░░░                     │   │   │
│  │  │  Frístund (1 lið)          25.000 kr    29.4%    │   │   │
│  │  │  ███████░░░░░░░░░░░░░░░░░░░░                     │   │   │
│  │  │  ...                                              │   │   │
│  │  └───────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  Fótur (Footer)                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Farsíma útlit (< 768px)**:

```
┌─────────────────────────┐
│  Haus         [☰ Valmynd]│
├─────────────────────────┤
│                         │
│  [Reiknivél fyrst]      │
│  → actualHourlyWage     │
│                         │
├─────────────────────────┤
│  Umönnunar/Menntakostn. │
│                         │
│  ┌─────────────────────┐│
│  │ Á mánuði            ││
│  │ 85.000 kr           ││
│  │ 34 klst             ││
│  └─────────────────────┘│
│                         │
│  [Leikskóli ▼]          │
│  Tegund: Sveitarfélag   │
│  Fjöldi: 2 börn         │
│  60.000 kr/mán          │
│                         │
│  [Frístund ▼]           │
│  [Tímar ▼]              │
│  [Einkakennsla ▼]       │
│  [Háskólasparnaður ▼]   │
│                         │
│  Sundurliðun            │
│  ┌─────────────────────┐│
│  │ Leikskóli    70.6%  ││
│  │ ████████░░          ││
│  └─────────────────────┘│
│                         │
├─────────────────────────┤
│  Fótur                  │
└─────────────────────────┘
```

### Lykilíhlutir

#### 1. ChildcareEducationCalculator

**Tilgangur**: Aðal íhlutur sem sýnir heildarmælirinn með samtölum, lífsorku og sundurliðun.

**Ábyrgð**:
- Sækir umönnunargögn úr Context
- Sýnir heildaryfirlit (samtölur, lífsorka)
- Stjórnar sýn á undirhluta (leikskóli, frístund, tímar, o.s.frv.)
- Sýnir viðvörunarboð ef actualHourlyWage vantar

**Opinbert viðmót**:
```typescript
interface ChildcareEducationCalculatorProps {
  className?: string;
}

// Notar Context:
const {
  childcareItems,
  childcareSummary,
  results, // fyrir actualHourlyWage
} = useCalculator();
```

**Framkvæmdaatriði**:
- Sýnir placeholder ef actualHourlyWage = 0: "Fylltu fyrst út Tímakaups reiknivélina hér að ofan"
- Notar Card íhlut fyrir samkvæmt útlit við aðalreiknivélina
- Rauntíma uppfærsla (useMemo í Context sér um útreikninga)

---

#### 2. DaycareSection

**Tilgangur**: Leikskóli kafli með tegundavali og fjölda barna.

**Ábyrgð**:
- Val fyrir tegund leikskóla (sveitarfélag, einkarekinn, annað)
- Inntak fyrir fjöldi barna
- Inntak fyrir mánaðarkostnað (forstillt eftir tegund)
- Útreikningur á heildarkostnaði

**Opinbert viðmót**:
```typescript
interface DaycareSectionProps {
  items: ChildcareItem[];
  onAdd: (item: Omit<ChildcareItem, 'id'>) => void;
  onUpdate: (id: string, item: Partial<ChildcareItem>) => void;
  onDelete: (id: string) => void;
}
```

**Framkvæmdaatriði**:
- Dropdown fyrir tegund með 3 valkostum
- Forstillt verð: Sveitarfélag 30.000 kr, Einkarekinn 60.000 kr
- Sýna útreikning: "30.000 kr × 2 börn = 60.000 kr/mán"
- Card layout með accordion fyrir fleiri upplýsingar

---

#### 3. AfterSchoolSection

**Tilgangur**: Frístundarkafli með sumarmánuði virkjun.

**Ábyrgð**:
- Inntak fyrir fjöldi barna í frístund
- Inntak fyrir mánaðarkostnað á barn
- Checkbox fyrir sumarmánuði (9 eða 12 mánuðir)
- Útreikningur á heildarkostnaði

**Opinbert viðmót**:
```typescript
interface AfterSchoolSectionProps {
  items: ChildcareItem[];
  onAdd: (item: Omit<ChildcareItem, 'id'>) => void;
  onUpdate: (id: string, item: Partial<ChildcareItem>) => void;
  onDelete: (id: string) => void;
}
```

**Framkvæmdaatriði**:
- Forstillt verð: 25.000 kr/mán
- Checkbox: "Sumarmánuðir virkir" (breytir 9 → 12 mánuði)
- Sýna útreikning: "25.000 kr × 1 barn × 9 mán = 225.000 kr/ári"
- Tooltip útskýrir muninn

---

#### 4. ActivitiesSection

**Tilgangur**: Tónlistarskóli og tímar með mörgum börnum og mörgum tímum.

**Ábyrgð**:
- Lista yfir alla tíma
- Bæta við nýjum tímum
- Breyta og eyða tímum
- Flýtival fyrir algengar tíma

**Opinbert viðmót**:
```typescript
interface ActivitiesSectionProps {
  items: ChildcareItem[];
  onAdd: (item: Omit<ChildcareItem, 'id'>) => void;
  onUpdate: (id: string, item: Partial<ChildcareItem>) => void;
  onDelete: (id: string) => void;
}
```

**Framkvæmdaatriði**:
- Modal/dropdown fyrir flýtival með algengum tímum
- Eyðublað með: Heiti, mánaðarkostnaður, fjöldi mánaða, fjöldi barna
- Listi yfir alla tíma með breyta/eyða hnöppum
- Forstillingar: Tónlistarskóli (15k, 9mán), Íþróttir (10k, 10mán), Sund (8k, 12mán)

---

#### 5. TutoringSection

**Tilgangur**: Einkakennsla með tímafjölda.

**Ábyrgð**:
- Inntak fyrir tegund kennslu (t.d. "Stærðfræði")
- Inntak fyrir kostnaður á klukkustund
- Inntak fyrir fjöldi klukkustunda á mánuði
- Útreikningur á mánaðar- og árskostnaði

**Opinbert viðmót**:
```typescript
interface TutoringSectionProps {
  items: ChildcareItem[];
  onAdd: (item: Omit<ChildcareItem, 'id'>) => void;
  onUpdate: (id: string, item: Partial<ChildcareItem>) => void;
  onDelete: (id: string) => void;
}
```

**Framkvæmdaatriði**:
- Forstillt: 8.000 kr/klst
- Eyðublað: Tegund, kostnaður/klst, fjöldi klukkustunda/mán
- Sýna útreikning: "8.000 kr × 4 klst = 32.000 kr/mán"

---

#### 6. UniversitySection

**Tilgangur**: Háskólasparnaður með framtíðarútreikningum.

**Ábyrgð**:
- Inntak fyrir aldur barns (núverandi og háskóli)
- Inntak fyrir áætlaður háskólakostnaður
- Útreikningur á mánaðarlegum sparnaði
- Sýna hversu margir mánuðir eru í undirbúning

**Opinbert viðmót**:
```typescript
interface UniversitySectionProps {
  items: ChildcareItem[];
  onAdd: (item: Omit<ChildcareItem, 'id'>) => void;
  onUpdate: (id: string, item: Partial<ChildcareItem>) => void;
  onDelete: (id: string) => void;
}
```

**Framkvæmdaatriði**:
- Eyðublað: Núverandi aldur, háskólaaldur, kostnaður/ári, fjöldi ára, ávöxtun%
- Sjálfgefið: 18 ára háskóli, 2.500.000 kr/ári, 3 ár, 5% ávöxtun
- Sýna: Heildarkostnaður, mánuðir þar til, mánaðarlegur sparnaður
- FV formúla til að reikna mánaðarlegan sparnað

---

#### 7. CategoryBreakdown

**Tilgangur**: Sýnir sundurliðun eftir flokkum með myndrænni framsetning.

**Ábyrgð**:
- Sýna hvern flokk með samtölu
- Raðað eftir kostnaði (hæstur fyrst)
- Sýna prósentu af heildarkostnaði
- Fjöldi liða í hverjum flokki

**Opinbert viðmót**:
```typescript
interface CategoryBreakdownProps {
  breakdown: ChildcareSummary['byCategory'];
  totalMonthly: number;
}
```

**Framkvæmdaatriði**:
- Horizontal bar chart eða einföld lista
- Litakóðun eftir flokkum
- Sýna bæði ISK upphæð og prósentu
- Collapsible á farsíma

---

#### 8. ScenarioComparison

**Tilgangur**: Samanburður á milli tveggja eða fleiri sviðsmynda.

**Ábyrgð**:
- Sýna mismun í mánaðarkostnaði
- Sýna mismun í lífsorku
- Sýna áhrif á FI dagsetning (ef FI gögn til staðar)
- Hlið við hlið samanburður

**Opinbert viðmót**:
```typescript
interface ScenarioComparisonProps {
  scenarios: ChildcareSummary[];
  scenarioNames: string[];
}
```

**Framkvæmdaatriði**:
- Tafla með sviðsmyndum í dálkum
- Raðir: Mánaðarkostnaður, Árskostnaður, Lífsorka, FI áhrif
- Highlight mismunur með litum (grænn = sparnaður, rauður = kostnaður)
- Valfrjálst (gæti verið framtíðarútvíkkun)

---

### UI íhlutir (endurnýttir)

Nota sömu grunnviðmót og aðalreiknivélin fyrir samkvæmni:

- **Button**: Aðgerðir (bæta við, vista, hætta við)
- **Input**: Textareitir (heiti, upphæðir, fjöldi)
- **Select**: Valmynd fyrir tegund
- **Card**: Kort fyrir hópun efnis
- **Checkbox**: Fyrir sumarmánuði og aðra valkosti
- **Modal**: Fyrir eyðublöð og flýtival
- **Tooltip**: Fyrir útskýringar

## Gagnalíkön

### Kjarnabreytingar

Allar tegundir eru skilgreindar í `src/types/calculator.ts`.

#### ChildcareItem

```typescript
/**
 * Einn umönnunar- eða menntakostnaðarliður
 */
export interface ChildcareItem {
  id: string;                        // Einstakt auðkenni (generað)
  category: ChildcareCategory;       // Flokkur
  name: string;                      // Heiti liðar (t.d. "Leikskóli Kópavogi")
  monthlyCost: number;               // Mánaðarlegur kostnaður í ISK
  monthsPerYear: number;             // Fjöldi mánaða á ári (9-12)
  numberOfChildren: number;          // Fjöldi barna (1+)
  details?: ChildcareDetails;        // Aukagögn eftir tegund
}
```

**Staðfestingarreglur**:
- `name`: Ekki tómt, hámark 100 stafir
- `monthlyCost`: Verður að vera >= 0
- `monthsPerYear`: 1-12
- `numberOfChildren`: >= 1
- `category`: Einn af 5 gildum flokkunum

---

#### ChildcareCategory

```typescript
/**
 * Flokkar fyrir umönnunar- og menntakostnað
 */
export type ChildcareCategory =
  | 'daycare'      // Leikskóli
  | 'afterschool'  // Frístund
  | 'activities'   // Tónlistarskóli, íþróttir, dans
  | 'tutoring'     // Einkakennsla
  | 'university';  // Háskólasparnaður
```

**Íslensku merki**:
```typescript
export const CHILDCARE_CATEGORY_LABELS: Record<ChildcareCategory, string> = {
  daycare: 'Leikskóli',
  afterschool: 'Frístund',
  activities: 'Tónlistarskóli og tímar',
  tutoring: 'Einkakennsla',
  university: 'Háskólasparnaður',
};
```

---

#### ChildcareDetails

```typescript
/**
 * Aukagögn sem fara eftir flokkum
 */
export interface ChildcareDetails {
  // Fyrir leikskóla
  daycareType?: 'municipal' | 'private' | 'other';

  // Fyrir frístund
  summerMonthsActive?: boolean;  // Hvort frístund er á sumrin

  // Fyrir tímar
  activityType?: string;         // T.d. "Píanó", "Fótbolti"

  // Fyrir einkakennslu
  hourlyRate?: number;           // Kostnaður á klukkustund
  hoursPerMonth?: number;        // Fjöldi klukkustunda á mánuði

  // Fyrir háskóla
  currentAge?: number;           // Núverandi aldur barns
  collegeAge?: number;           // Aldur þegar byrjar í háskóla
  costPerYear?: number;          // Háskólakostnaður á ári
  yearsInCollege?: number;       // Fjöldi ára í háskóla
  expectedReturn?: number;       // Áætluð ávöxtun (0.03, 0.05, 0.07)
}
```

---

#### ChildcareSummary

```typescript
/**
 * Samantekt á umönnunar- og menntakostnaði með útreikningum
 */
export interface ChildcareSummary {
  totalMonthlyAverage: number;       // Meðaltal mánaðarkostnaður
  totalYearly: number;               // Heildar árskostnaður
  lifeEnergyHoursPerMonth: number;   // Lífsorku klukkustundir á mánuði
  lifeEnergyHoursPerYear: number;    // Lífsorku klukkustundir á ári
  byCategory: {                      // Sundurliðun eftir flokkum
    category: ChildcareCategory;
    label: string;                   // Íslenskt heiti
    totalYearly: number;             // Samtala í þessum flokki (árlega)
    totalMonthly: number;            // Meðaltal mánaðarleg
    count: number;                   // Fjöldi liða í flokki
  }[];
  universitySavings?: {              // Háskólasparnaður (ef til staðar)
    totalCost: number;               // Heildarkostnaður háskóla
    monthsUntilCollege: number;      // Mánuðir þar til háskóli
    monthlyPaymentNeeded: number;    // Mánaðarlegur sparnaður þarf
  };
}
```

**Útreikningur**:
- Gerð af `calculateChildcareSummary()` í `lib/calculations/childcare.ts`
- Keyrir sjálfkrafa í `useMemo` hook þegar childcareItems eða `actualHourlyWage` breytast
- Skilar alltaf gildu summary, jafnvel ef engir liðir (öll gildi = 0)

---

#### StoredState (Uppfært)

```typescript
/**
 * Fullt app state sem vistað er í localStorage
 */
export interface StoredState {
  version: number;                   // Útgáfunúmer (fyrir migration)
  currentInputs: CalculatorInputs;   // Núverandi innsláttur í aðalreiknivél
  scenarios: Scenario[];             // Vistaðar aðstæður
  subscriptions: Subscription[];     // Áskriftalistinn
  childcareItems: ChildcareItem[];   // Umönnunar-/menntalistar (NÝTT)
  lastUpdated: string;               // ISO dagsetning
}
```

---

### Sjálfgefin gildi

```typescript
// lib/defaults.ts (bæta við)

export const DEFAULT_CHILDCARE_ITEM: Omit<ChildcareItem, 'id'> = {
  category: 'daycare',
  name: '',
  monthlyCost: 0,
  monthsPerYear: 12,
  numberOfChildren: 1,
};

export const DEFAULT_DAYCARE: Omit<ChildcareItem, 'id'> = {
  category: 'daycare',
  name: 'Leikskóli',
  monthlyCost: 30000,
  monthsPerYear: 12,
  numberOfChildren: 1,
  details: {
    daycareType: 'municipal',
  },
};

export const DEFAULT_AFTERSCHOOL: Omit<ChildcareItem, 'id'> = {
  category: 'afterschool',
  name: 'Frístund',
  monthlyCost: 25000,
  monthsPerYear: 9,
  numberOfChildren: 1,
  details: {
    summerMonthsActive: false,
  },
};

export const DEFAULT_UNIVERSITY_SAVINGS: Omit<ChildcareItem, 'id'> = {
  category: 'university',
  name: 'Háskólasparnaður',
  monthlyCost: 0, // Reiknað
  monthsPerYear: 12,
  numberOfChildren: 1,
  details: {
    currentAge: 0,
    collegeAge: 18,
    costPerYear: 2500000,
    yearsInCollege: 3,
    expectedReturn: 0.05,
  },
};
```

---

### Algengar forstillingar

Skilgreint í `lib/calculations/childcare.ts`:

```typescript
export const COMMON_CHILDCARE_ITEMS: Omit<ChildcareItem, 'id'>[] = [
  // Leikskóli
  {
    category: 'daycare',
    name: 'Leikskóli sveitarfélags',
    monthlyCost: 30000,
    monthsPerYear: 12,
    numberOfChildren: 1,
    details: { daycareType: 'municipal' },
  },
  {
    category: 'daycare',
    name: 'Leikskóli einkarekinn',
    monthlyCost: 60000,
    monthsPerYear: 12,
    numberOfChildren: 1,
    details: { daycareType: 'private' },
  },

  // Frístund
  {
    category: 'afterschool',
    name: 'Frístund (vetur)',
    monthlyCost: 25000,
    monthsPerYear: 9,
    numberOfChildren: 1,
    details: { summerMonthsActive: false },
  },
  {
    category: 'afterschool',
    name: 'Frístund (heilt ár)',
    monthlyCost: 25000,
    monthsPerYear: 12,
    numberOfChildren: 1,
    details: { summerMonthsActive: true },
  },

  // Tímar
  {
    category: 'activities',
    name: 'Tónlistarskóli',
    monthlyCost: 15000,
    monthsPerYear: 9,
    numberOfChildren: 1,
    details: { activityType: 'Tónlist' },
  },
  {
    category: 'activities',
    name: 'Íþróttir (knattspyrna, handbolti)',
    monthlyCost: 10000,
    monthsPerYear: 10,
    numberOfChildren: 1,
    details: { activityType: 'Íþróttir' },
  },
  {
    category: 'activities',
    name: 'Sund',
    monthlyCost: 8000,
    monthsPerYear: 12,
    numberOfChildren: 1,
    details: { activityType: 'Sund' },
  },
  {
    category: 'activities',
    name: 'Dans',
    monthlyCost: 12000,
    monthsPerYear: 9,
    numberOfChildren: 1,
    details: { activityType: 'Dans' },
  },

  // Einkakennsla
  {
    category: 'tutoring',
    name: 'Einkakennsla (stærðfræði)',
    monthlyCost: 32000, // 8000 kr/klst × 4 klst
    monthsPerYear: 12,
    numberOfChildren: 1,
    details: {
      hourlyRate: 8000,
      hoursPerMonth: 4,
    },
  },
];
```

**Athugasemd**: Verð eru dæmigerð gildi frá janúar 2025 og gætu þurft uppfærslu.

## Villumeðhöndlun

### Inntaksstaðfesting

```typescript
// lib/utils/validators.ts (bæta við)

/**
 * Staðfesta umönnunar-/menntaliður
 */
export function validateChildcareItem(
  item: Omit<ChildcareItem, 'id'>
): ValidationResult {
  const errors: Record<string, string> = {};

  // Nafn
  if (!item.name || item.name.trim() === '') {
    errors['name'] = 'Nafn má ekki vera tómt';
  }
  if (item.name.length > 100) {
    errors['name'] = 'Nafn má ekki vera lengra en 100 stafir';
  }

  // Kostnaður
  if (item.monthlyCost < 0) {
    errors['monthlyCost'] = 'Kostnaður má ekki vera neikvæður';
  }
  if (isNaN(item.monthlyCost)) {
    errors['monthlyCost'] = 'Kostnaður verður að vera tala';
  }
  if (item.monthlyCost > 500000) {
    errors['monthlyCost'] = 'Kostnaður virðist óraunhæfur (> 500.000 kr/mán)';
  }

  // Mánuðir á ári
  if (item.monthsPerYear < 1 || item.monthsPerYear > 12) {
    errors['monthsPerYear'] = 'Fjöldi mánaða verður að vera 1-12';
  }

  // Fjöldi barna
  if (item.numberOfChildren < 1) {
    errors['numberOfChildren'] = 'Fjöldi barna verður að vera að minnsta kosti 1';
  }
  if (item.numberOfChildren > 10) {
    errors['numberOfChildren'] = 'Fjöldi barna virðist óraunhæfur (> 10)';
  }

  // Flokkur
  const validCategories: ChildcareCategory[] = [
    'daycare',
    'afterschool',
    'activities',
    'tutoring',
    'university',
  ];
  if (!validCategories.includes(item.category)) {
    errors['category'] = 'Ógildur flokkur';
  }

  // Háskóli sérstakar reglur
  if (item.category === 'university' && item.details) {
    const { currentAge, collegeAge } = item.details;
    if (currentAge !== undefined && collegeAge !== undefined) {
      if (currentAge < 0 || currentAge > 17) {
        errors['currentAge'] = 'Núverandi aldur verður að vera 0-17';
      }
      if (collegeAge < 18 || collegeAge > 25) {
        errors['collegeAge'] = 'Háskólaaldur verður að vera 18-25';
      }
      if (currentAge >= collegeAge) {
        errors['collegeAge'] = 'Háskólaaldur verður að vera hærri en núverandi aldur';
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
```

### Villutilvik og svör

#### 1. Vantar raunverulegt tímakaup

**Ástand**: Notandi opnar Umönnunarreiknivél en hefur ekki fyllt út Tímakaups reiknivélina.

**Greining**: `results?.actualHourlyWage` er `undefined` eða `0`

**Svar**:
- Sýna viðvörunarbox í ChildcareEducationCalculator:
  ```
  ⚠️ Til að sjá lífsorku kostnað þarftu að fylla fyrst út
     Raunverulega Tímakaups reiknivélina hér að ofan.
  ```
- Sýna samt ISK upphæðir (totalMonthly, totalYearly)
- Fela lífsorku gildi (lifeEnergyHours)
- Leyfa samt að bæta við liðum

**Notendaboð**: "Fylltu fyrst út Tímakaups reiknivélina til að sjá lífsorku kostnað"

**Logging**: Ekkert (venjuleg notkun)

**Endurheimt**: Notandi fyllir út Tímakaups reiknivélina → lífsorka gildi birtast sjálfkrafa

---

#### 2. Ógilt inntak í eyðublaði

**Ástand**: Notandi reynir að vista lið með ógildri gögnum.

**Greining**: `validateChildcareItem()` skilar `isValid: false`

**Svar**:
- Sýna villuboð við viðkomandi reit
- Merkja villureit með rauðum ramma
- Hindra vistun þar til villur eru lagaðar
- Sýna villuyfirlit efst í eyðublaði ef margar villur

**Notendaboð**: Sértæk villuboð við hvern reit

**Logging**: `console.warn('Validation failed:', errors)`

**Endurheimt**: Notandi leiðréttir innslættinn → villur hverfa

---

#### 3. Óraunhæf gildi

**Ástand**: Notandi slær inn mjög háar upphæðir (t.d. 1.000.000 kr/mán).

**Greining**: Gildi fara yfir skilgreind mörk

**Svar**:
- Sýna viðvörun: "Þessi upphæð virðist óraunhæf. Ertu viss?"
- Leyfa samt vistun ef notandi staðfestir
- Sanngirnispróf með tooltip: "Dæmigerð upphæð: 30.000-60.000 kr/mán"

**Notendaboð**: "Upphæðin virðist óraunhæf, en þú getur haldið áfram ef hún er rétt"

**Logging**: `console.warn('Unusual value entered:', value)`

**Endurheimt**: Notandi breytir gildi eða staðfestir

---

#### 4. Háskólasparnaður útreikningur

**Ástand**: Notandi slær inn gögn sem gefa óraunhæfa mánaðarlega sparnað.

**Greining**: Mánaðarlegur sparnaður > 500.000 kr eða barn þegar of gamalt

**Svar**:
- Ef barn þegar of gamalt (currentAge >= collegeAge):
  - "Barnið er þegar komið í háskólaaldur. Stilltu lægri háskólaaldur eða hærri núverandi aldur."
- Ef mánaðarlegur sparnaður óraunhæfur:
  - "Mánaðarlegur sparnaður (X kr) virðist óraunhæfur. Athugaðu inntökin."

**Notendaboð**: Sértæk villuboð eftir aðstæðum

**Logging**: `console.warn('University savings calculation issue:', details)`

**Endurheimt**: Notandi leiðréttir inntök

---

### Villuboð á íslensku

```typescript
// lib/constants/errorMessages.ts (uppfæra)

export const CHILDCARE_ERROR_MESSAGES = {
  // Staðfesting
  REQUIRED_FIELD: 'Þessi reitur má ekki vera tómur',
  INVALID_NUMBER: 'Verður að vera gild tala',
  INVALID_AMOUNT: 'Upphæð má ekki vera neikvæð',
  NAME_TOO_LONG: 'Nafn má ekki vera lengra en 100 stafir',
  MONTHS_OUT_OF_RANGE: 'Fjöldi mánaða verður að vera 1-12',
  CHILDREN_OUT_OF_RANGE: 'Fjöldi barna virðist óraunhæfur',
  AMOUNT_TOO_HIGH: 'Upphæð virðist óraunhæf (> 500.000 kr/mán)',

  // Háskóli
  AGE_OUT_OF_RANGE: 'Aldur verður að vera innan 0-25 ára',
  COLLEGE_AGE_TOO_LOW: 'Háskólaaldur verður að vera hærri en núverandi aldur',
  ALREADY_IN_COLLEGE: 'Barnið er þegar komið í háskólaaldur',
  UNREALISTIC_SAVINGS: 'Mánaðarlegur sparnaður virðist óraunhæfur',

  // Kerfisvillur
  STORAGE_FULL: 'Vistun mistókst. Flettu út gögnunum og reyndu aftur.',
  NO_WAGE_CALCULATED: 'Fylltu fyrst út Tímakaups reiknivélina',
  DELETE_CONFIRMATION: 'Ertu viss um að þú viljir eyða þessum lið?',
};
```

## Prófunarstefna

### Einingarprófanir (Unit Tests)

**Markmið**: Prófa einstakar aðferðir/föll í einangrun.

#### Útreikningsföll (childcare.ts)

```typescript
describe('calculateChildcareSummary', () => {
  const testItems: ChildcareItem[] = [
    {
      id: '1',
      category: 'daycare',
      name: 'Leikskóli',
      monthlyCost: 30000,
      monthsPerYear: 12,
      numberOfChildren: 2,
    },
    {
      id: '2',
      category: 'afterschool',
      name: 'Frístund',
      monthlyCost: 25000,
      monthsPerYear: 9,
      numberOfChildren: 1,
    },
  ];

  it('ætti að reikna heildarárskostnað rétt', () => {
    const summary = calculateChildcareSummary(testItems, 2000);
    // Leikskóli: 30000 × 12 × 2 = 720.000
    // Frístund: 25000 × 9 × 1 = 225.000
    // Heildar: 945.000
    expect(summary.totalYearly).toBe(945000);
  });

  it('ætti að reikna meðaltal mánaðarkostnaðar rétt', () => {
    const summary = calculateChildcareSummary(testItems, 2000);
    // 945.000 / 12 = 78.750
    expect(summary.totalMonthlyAverage).toBe(78750);
  });

  it('ætti að reikna lífsorku rétt', () => {
    const summary = calculateChildcareSummary(testItems, 2000);
    // 78.750 kr / 2000 kr/klst = 39.375 klst
    expect(summary.lifeEnergyHoursPerMonth).toBeCloseTo(39.375, 2);
  });

  it('ætti að flokka rétt eftir category', () => {
    const summary = calculateChildcareSummary(testItems, 2000);
    expect(summary.byCategory).toHaveLength(2);
    expect(summary.byCategory[0].category).toBe('daycare'); // Hæstur
    expect(summary.byCategory[0].count).toBe(1);
  });
});

describe('calculateUniversitySavings', () => {
  it('ætti að reikna mánaðarlegan sparnað rétt', () => {
    const result = calculateUniversitySavings({
      currentAge: 5,
      collegeAge: 18,
      costPerYear: 2500000,
      yearsInCollege: 3,
      expectedReturn: 0.05,
    });

    // Heildarkostnaður: 2.500.000 × 3 = 7.500.000
    // Mánuðir þar til: (18 - 5) × 12 = 156 mánuðir
    expect(result.totalCost).toBe(7500000);
    expect(result.monthsUntilCollege).toBe(156);
    expect(result.monthlyPaymentNeeded).toBeGreaterThan(0);
  });

  it('ætti að skila 0 ef barn þegar í háskóla', () => {
    const result = calculateUniversitySavings({
      currentAge: 20,
      collegeAge: 18,
      costPerYear: 2500000,
      yearsInCollege: 3,
      expectedReturn: 0.05,
    });

    expect(result.monthsUntilCollege).toBe(0);
    expect(result.monthlyPaymentNeeded).toBe(0);
  });
});
```

#### Staðfesting (validators.ts)

```typescript
describe('validateChildcareItem', () => {
  it('ætti að samþykkja gilt inntak', () => {
    const item: Omit<ChildcareItem, 'id'> = {
      category: 'daycare',
      name: 'Leikskóli',
      monthlyCost: 30000,
      monthsPerYear: 12,
      numberOfChildren: 2,
    };
    const result = validateChildcareItem(item);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('ætti að hafna tómu nafni', () => {
    const item: Omit<ChildcareItem, 'id'> = {
      category: 'daycare',
      name: '',
      monthlyCost: 30000,
      monthsPerYear: 12,
      numberOfChildren: 1,
    };
    const result = validateChildcareItem(item);
    expect(result.isValid).toBe(false);
    expect(result.errors['name']).toBeDefined();
  });

  it('ætti að hafna neikvæðum kostnaði', () => {
    const item: Omit<ChildcareItem, 'id'> = {
      category: 'daycare',
      name: 'Test',
      monthlyCost: -1000,
      monthsPerYear: 12,
      numberOfChildren: 1,
    };
    const result = validateChildcareItem(item);
    expect(result.isValid).toBe(false);
    expect(result.errors['monthlyCost']).toBeDefined();
  });
});
```

### Samþættingarprófanir (Integration Tests)

**Markmið**: Prófa samskipti milli íhluta og Context.

```typescript
describe('CalculatorContext - Childcare', () => {
  it('ætti að bæta við umönnunarlið', () => {
    const { result } = renderHook(() => useCalculator(), {
      wrapper: CalculatorProvider,
    });

    act(() => {
      result.current.addChildcareItem({
        category: 'daycare',
        name: 'Leikskóli',
        monthlyCost: 30000,
        monthsPerYear: 12,
        numberOfChildren: 2,
      });
    });

    expect(result.current.childcareItems).toHaveLength(1);
    expect(result.current.childcareItems[0].name).toBe('Leikskóli');
  });

  it('ætti að uppfæra childcareSummary þegar liðum breytt', () => {
    const { result } = renderHook(() => useCalculator(), {
      wrapper: CalculatorProvider,
    });

    act(() => {
      result.current.updateIncome({ grossAnnualIncome: 6000000 });
    });

    act(() => {
      result.current.addChildcareItem({
        category: 'daycare',
        name: 'Leikskóli',
        monthlyCost: 30000,
        monthsPerYear: 12,
        numberOfChildren: 2,
      });
    });

    expect(result.current.childcareSummary?.totalYearly).toBe(720000);
  });
});
```

### Íhlutaprófanir (Component Tests)

```typescript
describe('DaycareSection', () => {
  it('ætti að sýna forstillt verð fyrir sveitarfélag', () => {
    render(<DaycareSection items={[]} onAdd={jest.fn()} />);

    const select = screen.getByLabelText(/Tegund/i);
    fireEvent.change(select, { target: { value: 'municipal' } });

    expect(screen.getByDisplayValue('30000')).toBeInTheDocument();
  });

  it('ætti að margfalda með fjölda barna', () => {
    const onAdd = jest.fn();
    render(<DaycareSection items={[]} onAdd={onAdd} />);

    fireEvent.change(screen.getByLabelText(/Fjöldi barna/i), {
      target: { value: '2' },
    });

    expect(screen.getByText(/60.000 kr/i)).toBeInTheDocument();
  });
});
```

## Hönnunarákvarðanir

### Ákvörðun 1: Samþætting með núverandi Context

**Samhengi**: Umönnunarreiknivélin þarf aðgang að `actualHourlyWage` úr aðalreiknivélinni.

**Valkostir sem skoðaðir voru**:

1. **Aðskilinn Context fyrir umönnun**
   - Kostir: Betri aðskilnaður
   - Gallar: Þarf samskiptalög milli tveggja Context, flóknara

2. **Samþætting í núverandi CalculatorContext** (VALIÐ)
   - Kostir: Ein heimild sannleikans, sjálfvirk uppfærsla
   - Gallar: CalculatorContext verður stærri

**Ákvörðun**: Samþætta í núverandi CalculatorContext

**Rökstuðningur**:
- Umönnunarreiknivél er ekki sjálfstæð - þarf actualHourlyWage
- Ein localStorage vistun einfaldar export/import
- Fylgir sömu hugmyndafræði og áskriftareiknivél

---

### Ákvörðun 2: 5 flokkar kostnaðar

**Samhengi**: Þarf að flokka umönnunar- og menntakostnað á skynsamlegan hátt.

**Valkostir**:

1. **Mjög nákvæm flokkun (10+ flokkar)**
   - Gallar: Of flókið, erfitt að velja

2. **5 flokkar** (VALIÐ)
   - Kostir: Nær yfir allar helstu aðstæður, auðvelt að skilja

**Ákvörðun**: 5 flokkar - daycare, afterschool, activities, tutoring, university

**Rökstuðningur**:
- Náer yfir allan kostnaðinn frá leikskóla til háskóla
- Samræmist því hvernig foreldrar hugsa um kostnað
- Auðvelt að flokka og skilja

---

### Ákvörðun 3: Háskólasparnaður með FV formúlu

**Samhengi**: Þarf að reikna mánaðarlegan sparnað fyrir háskóla.

**Valkostir**:

1. **Einföld deiling (totalCost / months)**
   - Kostir: Einfalt
   - Gallar: Tekur ekki tillit til ávöxtunar

2. **Future Value formúla** (VALIÐ)
   - Kostir: Raunhæfari, tekur tillit til ávöxtunar
   - Gallar: Örlítið flóknara

**Ákvörðun**: Nota FV formúlu með 5% sjálfgefinni ávöxtun

**Rökstuðningur**:
- Raunhæfari fyrir langtíma sparnað
- 5% er íhaldssamt og raunhæft
- Notandi getur stillt ávöxtunarprósentu

---

## Rekjanleiki við kröfur

### NS-1: Skrá leikskólakostnað

**Hönnunarþættir**:
- **Íhlutur**: DaycareSection
- **Gagnalíkan**: ChildcareItem með category='daycare'
- **Útreikningur**: calculateChildcareSummary()
- **Prófanir**: Einingarprófun á leikskólaútreikningum

---

### NS-2: Skrá frístundarkostnað

**Hönnunarþættir**:
- **Íhlutur**: AfterSchoolSection
- **Gagnalíkan**: ChildcareItem með category='afterschool'
- **Details**: summerMonthsActive boolean
- **Útreikningur**: Tekur tillit til 9 vs 12 mánaða

---

### NS-3: Skrá tónlistarskóla og aðra tíma

**Hönnunarþættir**:
- **Íhlutur**: ActivitiesSection
- **Gagnalíkan**: ChildcareItem með category='activities'
- **Forstillingar**: COMMON_CHILDCARE_ITEMS með algengum tímum

---

### NS-4: Skrá einkakennslu

**Hönnunarþættir**:
- **Íhlutur**: TutoringSection
- **Gagnalíkan**: ChildcareItem með category='tutoring'
- **Details**: hourlyRate, hoursPerMonth

---

### NS-5: Áætla háskólakostnað

**Hönnunarþættir**:
- **Íhlutur**: UniversitySection
- **Útreikningur**: calculateUniversitySavings() með FV formúlu
- **Details**: currentAge, collegeAge, costPerYear, yearsInCollege, expectedReturn

---

### NS-6: Sjá heildarkostnað í lífsorku

**Hönnunarþættir**:
- **Útreikningur**: lifeEnergyHours í ChildcareSummary
- **Sýning**: ChildcareEducationCalculator heildaryfirlit

---

### NS-7: Sjá sundurliðun eftir flokkum

**Hönnunarþættir**:
- **Íhlutur**: CategoryBreakdown
- **Gagnalíkan**: ChildcareSummary.byCategory[]

---

### NS-8: Bera saman sviðsmyndir

**Hönnunarþættir**:
- **Íhlutur**: ScenarioComparison (valfrjálst)
- **Framtíðarútvíkkun**: Getum notað scenario kerfi frá aðalreiknivél

---

### NS-9: Flýtival fyrir algengan kostnað

**Hönnunarþættir**:
- **Gögn**: COMMON_CHILDCARE_ITEMS
- **Íhlutur**: Flýtival í hverri Section

---

## Næstu skref

1. **Klára TypeScript tegundir** í calculator.ts
2. **Útfæra útreikningavél** í childcare.ts
3. **Uppfæra CalculatorContext** með childcare stuðningi
4. **Búa til íhluti** (8 íhlutir)
5. **Skrifa prófanir** (unit, integration, component)
6. **Aðgengismál** (ARIA, keyboard navigation)
7. **E2E prófanir** á fullu notendaflæði
