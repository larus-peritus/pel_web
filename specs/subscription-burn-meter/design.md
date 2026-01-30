# Hönnunarskjal: Áskriftakostnaðarmælir

## Yfirlit

**Eiginleiki**: Áskriftakostnaðarmælir (Subscription Burn Meter)
**Forrit**: peninganaedalifid.is
**Kröfuskjal**: [requirements.md](./requirements.md)

### Samantekt

Áskriftakostnaðarmælirinn er samþættur eiginleiki sem hjálpar notendum að sjá raunverulegan kostnað áskrifta sinna - ekki bara í krónum, heldur í **lífsorku** (klukkustundum af vinnu) og **fjárhagslegu frelsi** (hversu mikið framtíðarverðmæti missir þú af).

Eiginleikinn byggir á núverandi Raunverulega Tímakaups reiknivélinni og notar `actualHourlyWage` til að umbreyta áskriftarkostnaði í merkingarbær gildi:
- **15.490 kr/mán** verður **8,2 klukkustundir/mán** af þinni lífsorku
- **185.880 kr/ári** gæti orðið **2.645.000 kr eftir 10 ár** ef fjárfest

### Kjarnaforsendur

1. **Client-only arkitektúr**: Engar netbeiðnir, öll gögn í localStorage
2. **Samþætting með aðalreiknivél**: Notar sama Context og `actualHourlyWage`
3. **Toggle frekar en eyða**: Notendur geta gert áskriftir óvirkar til að bera saman
4. **Íslenskt samhengi**: Algengar íslenskar áskriftir með raunverulegum verðum
5. **FI áhersla**: Sýnir framtíðarverðmæti við 7% ávöxtun (10 og 20 ár)

### Lykilíhlutir

- **SubscriptionBurnMeter**: Aðal mælir með samtölum, lífsorku og FI áhrifum
- **SubscriptionList**: Flokkaður listi áskrifta (raðað eftir kostnaði)
- **SubscriptionForm**: Eyðublað til að bæta við/breyta áskriftum
- **QuickAddPresets**: Flýtival fyrir algengar áskriftir (Netflix, Spotify, o.s.frv.)
- **FutureValueDisplay**: Sýnir framtíðarverðmæti ef fjárfest í staðinn

### Tæknistafl

- **React** + **TypeScript**: Fyrir UI íhluti með tegundaöryggi
- **Context API**: Sameiginleg stöðustjórnun með aðalreiknivél
- **localStorage**: Vistun gagna (engin backend)
- **Tailwind CSS**: Samræmd stílsetning
- **useMemo**: Rauntíma útreikningar án endurútreiknings

### Lykilútreikningar

```typescript
// Lífsorka kostnaður
lifeEnergyHours = totalMonthlyCost / actualHourlyWage

// Framtíðarverðmæti (FV formúla)
FV = monthlyPayment × ((1 + r)^n - 1) / r
// þar sem r = 0.07/12 (mánaðarleg ávöxtun)
// og n = 120 mánaðir (10 ár) eða 240 (20 ár)
```

### Hönnunarákvarðanir

Sex meginákvarðanir mótuðu hönnunina:

1. **Samþætting í CalculatorContext** (ekki aðskilinn Context)
2. **Toggle virkni** með `isActive` flag (ekki bara eyða)
3. **Fast 7% ávöxtun** (með skýrum fyrirvara)
4. **Harðkóðaðar forstillingar** (ekki API fyrir verð)
5. **6 flokkar áskrifta** (optimal jafnvægi)
6. **Tailwind CSS** (samræmi við núverandi kóða)

### Staða útfærslu

**Þegar útfært**:
- ✅ TypeScript tegundir (`Subscription`, `SubscriptionCategory`, `SubscriptionSummary`)
- ✅ Útreikningsföll (`calculateSubscriptionSummary`, `calculateFutureValue`)
- ✅ Context uppfærður með áskrifta stjórnun
- ✅ Algengar áskriftir skilgreindar (`COMMON_SUBSCRIPTIONS`)

**Eftirstöðvar útfærslu**:
- ⏳ UI íhlutir (7 íhlutir að búa til)
- ⏳ Staðfestingar (`validateSubscription`)
- ⏳ Villumeðhöndlun og notendaboð
- ⏳ Prófanir (unit, integration, E2E)
- ⏳ Aðgengismál (ARIA labels, keyboard navigation)

### Næstu skref

1. Búa til `SubscriptionBurnMeter` aðal íhlut
2. Útfæra `SubscriptionForm` með staðfestingu
3. Búa til `SubscriptionList` og `SubscriptionItem`
4. Útfæra `QuickAddPresets` með leit
5. Bæta við villuboðum og loading states
6. Skrifa prófanir fyrir alla virkni
7. Accessibility audit og lagfæringar
8. E2E prófanir á fullu notendaflæði

## Arkitektúr

### Yfirlit kerfis

Áskriftakostnaðarmælirinn er samþættur eiginleiki sem byggir á núverandi Raunverulega Tímakaups reiknivélinni. Hann notar `actualHourlyWage` gildið til að umbreyta áskriftarkostnaði í lífsorku (klukkustundir) og sýnir framtíðarverðmæti ef fjárfest væri í staðinn.

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
│  │  │  - Áskriftalistinn (subscriptions[])                 │ │  │
│  │  │  - localStorage stjórnun                             │ │  │
│  │  └────────────────┬─────────────────────────────────────┘ │  │
│  │                   │                                        │  │
│  │  ┌────────────────┼────────────────────────────────────┐  │  │
│  │  │                │                                     │  │  │
│  │  │  ┌─────────────▼──────────┐  ┌──────────────────┐   │  │  │
│  │  │  │ Aðalreiknivél          │  │ Áskriftamælir    │   │  │  │
│  │  │  │ (Wage Calculator)      │  │                  │   │  │  │
│  │  │  │                        │  │                  │   │  │  │
│  │  │  │ - Tekjuinnsláttur      │  │ - Áskriftarlisti │   │  │  │
│  │  │  │ - Kostnaðarinnsláttur  │  │ - Flýtival       │   │  │  │
│  │  │  │ - Niðurstöður          │  │ - Samtölur       │   │  │  │
│  │  │  │ - actualHourlyWage ────┼─▶│ - Lífsorka       │   │  │  │
│  │  │  └────────────────────────┘  │ - FI áhrif       │   │  │  │
│  │  │                               └──────────────────┘   │  │  │
│  │  │                                                       │  │  │
│  │  │  ┌────────────────────────────────────────────────┐  │  │  │
│  │  │  │         Útreikningavél (Calculations)          │  │  │  │
│  │  │  │  - subscriptions.ts (nýtt)                     │  │  │  │
│  │  │  │    * calculateSubscriptionSummary()            │  │  │  │
│  │  │  │    * calculateFutureValue()                    │  │  │  │
│  │  │  │  - lifeEnergy.ts (núverandi)                   │  │  │  │
│  │  │  │    * dollarsToLifeEnergy()                     │  │  │  │
│  │  │  └────────────────────────────────────────────────┘  │  │  │
│  │  │                                                       │  │  │
│  │  │  ┌────────────────────────────────────────────────┐  │  │  │
│  │  │  │      Gagnalög (Data Layer)                     │  │  │  │
│  │  │  │  - localStorage með Subscription[]             │  │  │  │
│  │  │  │  - JSON export/import (með áskriftum)          │  │  │  │
│  │  │  └────────────────────────────────────────────────┘  │  │  │
│  │  └───────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Gagnaflæði

1. **Notandi skráir tekjur** í aðalreiknivélina → `actualHourlyWage` er reiknað
2. **Notandi bætir við áskrift** → Viðbót við `subscriptions[]` array í Context
3. **Útreikningur keyrir sjálfkrafa** (useMemo):
   - Samtala virkra áskrifta → `totalMonthly`, `totalYearly`
   - Lífsorka → `lifeEnergyHoursPerMonth/Year` (notar `actualHourlyWage`)
   - Framtíðarverðmæti → `futureValueIn10/20Years` (við 7% ávöxtun)
   - Flokkasundurliðun → `byCategory[]` (raðað eftir kostnaði)
4. **Niðurstöður birtast** í rauntíma í SubscriptionBurnMeter íhlutinum
5. **Gögn vistuð** sjálfkrafa í localStorage (debounced 500ms)

### Samþættingarpunktar

**Með Raunverulegu Tímakaups reiknivélinni**:
- Deilir sama `CalculatorContext`
- Notar `results.actualHourlyWage` fyrir lífsorku útreikninga
- Ef `actualHourlyWage` er 0 eða undefined → sýna skilaboð um að fylla út aðalreiknivélina fyrst

**Með localStorage**:
- Bætt við `subscriptions: Subscription[]` í `StoredState` (þegar útfært)
- Flyst með export/import virkni
- Sama útgáfustjórnun (version number)

### Tæknival

**Núverandi tækni (endurnýtt)**:
- **React**: Fyrir UI íhluti
- **TypeScript**: Fyrir tegundaöryggi
- **Context API**: Fyrir stjórnun á stöðu
- **localStorage**: Fyrir geymslu gagna
- **Tailwind CSS**: Fyrir stílsetningu

**Ný virkni**:
- **Future Value útreikningur**: Samsett vaxtaformúla fyrir FI áhrif
- **Flokkakerfi**: 6 flokkar fyrir áskriftir (streaming, software, o.s.frv.)
- **Toggle virkni**: Til að gera áskriftir óvirkar án þess að eyða

**Ákvörðun**: Engin ytri söfn fyrir útreikninga (halda einfaldleika og bundle stærð lítilli).

### Möppubygging

```
apps/peninganaedalifid/
├── src/
│   ├── app/
│   │   └── page.tsx                     # Aðalsíða með báðum reiknivélum
│   │
│   ├── components/
│   │   ├── calculator/                  # Núverandi íhlutir
│   │   │   └── ...
│   │   │
│   │   └── subscriptions/               # NÝTT: Áskrifta íhlutir
│   │       ├── SubscriptionBurnMeter.tsx   # Aðal íhlutur
│   │       ├── SubscriptionList.tsx        # Listi áskrifta
│   │       ├── SubscriptionForm.tsx        # Eyðublað til að bæta við
│   │       ├── SubscriptionItem.tsx        # Einstök áskrift
│   │       ├── QuickAddPresets.tsx         # Flýtival fyrir algengar áskriftir
│   │       ├── CategoryBreakdown.tsx       # Sundurliðun eftir flokkum
│   │       └── FutureValueDisplay.tsx      # FI áhrif (10/20 ár)
│   │
│   ├── lib/
│   │   ├── calculations/
│   │   │   ├── subscriptions.ts         # ÞEGAR ÚTFÆRT
│   │   │   ├── lifeEnergy.ts           # Núverandi (endurnýtt)
│   │   │   └── ...
│   │   │
│   │   └── utils/
│   │       └── formatters.ts            # Bæta við ISK formöttun
│   │
│   ├── context/
│   │   └── CalculatorContext.tsx        # ÞEGAR UPPFÆRT með áskriftum
│   │
│   └── types/
│       └── calculator.ts                # ÞEGAR UPPFÆRT með áskrifta tegundum
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
│  │  [Núverandi reiknivél - eftir sem áður]                  │   │
│  │  → Skilar actualHourlyWage                               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ÁSKRIFTAKOSTNAÐARMÆLIR                                  │   │
│  │                                                           │   │
│  │  ┌───────────────────────────────────────────────────┐   │   │
│  │  │  Heildaryfirlit                                    │   │   │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌───────────┐  │   │   │
│  │  │  │ Á mánuði    │  │ Á ári       │  │ Virkar    │  │   │   │
│  │  │  │ 15.490 kr   │  │ 185.880 kr  │  │ 5 af 7    │  │   │   │
│  │  │  │ 8,2 klst    │  │ 98,4 klst   │  │           │  │   │   │
│  │  │  └─────────────┘  └─────────────┘  └───────────┘  │   │   │
│  │  └───────────────────────────────────────────────────┘   │   │
│  │                                                           │   │
│  │  ┌───────────────────────────────────────────────────┐   │   │
│  │  │  FI Áhrif (ef fjárfest við 7% ávöxtun)            │   │   │
│  │  │  Eftir 10 ár:  2.645.000 kr                       │   │   │
│  │  │  Eftir 20 ár:  7.680.000 kr                       │   │   │
│  │  └───────────────────────────────────────────────────┘   │   │
│  │                                                           │   │
│  │  [Bæta við áskrift]  [Flýtival ▼]                        │   │
│  │                                                           │   │
│  │  ┌───────────────────────────────────────────────────┐   │   │
│  │  │  Mínar áskriftir                                   │   │   │
│  │  │                                                    │   │   │
│  │  │  Streymi (3.879 kr/mán)                           │   │   │
│  │  │  ├ [⚫] Netflix          2.290 kr  [✏️] [🗑️]      │   │   │
│  │  │  ├ [⚫] Spotify          1.399 kr  [✏️] [🗑️]      │   │   │
│  │  │  └ [⚪] Disney+          1.290 kr  [✏️] [🗑️]      │   │   │
│  │  │                        (óvirk - ekki talin með)   │   │   │
│  │  │  Líkamsrækt (9.990 kr/mán)                        │   │   │
│  │  │  └ [⚫] World Class      9.990 kr  [✏️] [🗑️]      │   │   │
│  │  │                                                    │   │   │
│  │  │  Hugbúnaður (1.621 kr/mán)                        │   │   │
│  │  │  ├ [⚫] iCloud             149 kr  [✏️] [🗑️]      │   │   │
│  │  │  └ [⚫] Microsoft 365    1.099 kr  [✏️] [🗑️]      │   │   │
│  │  │                                                    │   │   │
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
│  Áskriftakostnaðarmælir │
│                         │
│  ┌─────────────────────┐│
│  │ Á mánuði            ││
│  │ 15.490 kr           ││
│  │ 8,2 klst            ││
│  └─────────────────────┘│
│  ┌─────────────────────┐│
│  │ FI áhrif (10 ár)    ││
│  │ 2.645.000 kr        ││
│  └─────────────────────┘│
│                         │
│  [Bæta við] [Flýtival ▼]│
│                         │
│  Streymi (3.879 kr/mán) │
│  ┌─────────────────────┐│
│  │ [⚫] Netflix         ││
│  │ 2.290 kr  [✏️] [🗑️]││
│  └─────────────────────┘│
│  ┌─────────────────────┐│
│  │ [⚫] Spotify         ││
│  │ 1.399 kr  [✏️] [🗑️]││
│  └─────────────────────┘│
│                         │
│  [Sýna meira...]        │
│                         │
├─────────────────────────┤
│  Fótur                  │
└─────────────────────────┘
```

### Lykilíhlutir

#### 1. SubscriptionBurnMeter

**Tilgangur**: Aðal íhlutur sem sýnir heildarmælirinn með samtölum, lífsorku og FI áhrifum.

**Ábyrgð**:
- Sækir áskriftagögn úr Context
- Sýnir heildaryfirlit (samtölur, lífsorka, FI áhrif)
- Stjórnar sýn á undirhluta (lista, flýtival)
- Sýnir viðvörunarboð ef actualHourlyWage vantar

**Opinbert viðmót**:
```typescript
interface SubscriptionBurnMeterProps {
  className?: string;
}

// Notar Context:
const {
  subscriptions,
  subscriptionSummary,
  results, // fyrir actualHourlyWage
} = useCalculator();
```

**Framkvæmdaatriði**:
- Sýnir placeholder ef actualHourlyWage = 0: "Fylltu fyrst út Tímakaups reiknivélina hér að ofan"
- Notar Card íhlut fyrir samkvæmt útlit við aðalreiknivélina
- Rauntíma uppfærsla (useMemo í Context sér um útreikninga)

---

#### 2. SubscriptionList

**Tilgangur**: Sýnir lista yfir allar áskriftir, flokkaðar eftir tegund.

**Ábyrgð**:
- Flokkar áskriftir eftir category
- Raðar flokkum eftir heildarkostnaði (hæst fyrst)
- Sýnir samtölu fyrir hvern flokk
- Render-ar SubscriptionItem fyrir hverja áskrift

**Opinbert viðmót**:
```typescript
interface SubscriptionListProps {
  subscriptions: Subscription[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}
```

**Framkvæmdaatriði**:
- Notað `byCategory` úr `subscriptionSummary` fyrir röðun
- Collapsible flokkar á farsíma (accordion pattern)
- Tómur ástand: "Engar áskriftir enn. Bættu við hér að neðan!"

---

#### 3. SubscriptionForm

**Tilgangur**: Eyðublað til að bæta við eða breyta áskrift.

**Ábyrgð**:
- Inntak fyrir nafn, mánaðarkostnað, flokk
- Staðfesting (validation) á inntaki
- Vista eða uppfæra áskrift í Context
- Núllstilla eyðublað eftir vistun

**Opinbert viðmót**:
```typescript
interface SubscriptionFormProps {
  mode: 'add' | 'edit';
  subscription?: Subscription; // fyrir edit mode
  onSave: (subscription: Omit<Subscription, 'id'>) => void;
  onCancel: () => void;
}
```

**Framkvæmdaatriði**:
- Modal eða inline form (ákveða eftir UX)
- Real-time validation:
  - Nafn: Ekki tómt
  - Kostnaður: > 0, aðeins tölur
  - Flokkur: Einn af 6 flokkunum
- Sjálfgefið: isActive = true

---

#### 4. SubscriptionItem

**Tilgangur**: Sýnir eina áskrift í listanum.

**Ábyrgð**:
- Sýna nafn, verð, stöðu (virk/óvirk)
- Toggle rofi til að virkja/afvirkja
- Breyta (edit) og eyða (delete) takkar

**Opinbert viðmót**:
```typescript
interface SubscriptionItemProps {
  subscription: Subscription;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}
```

**Framkvæmdaatriði**:
- Óvirkar áskriftir sýndar grátt með "Óvirk" merki
- Staðfesta eyðingu: "Ertu viss um að þú viljir eyða [nafn]?"
- Hover áhrif fyrir aðgerðir (edit, delete)

---

#### 5. QuickAddPresets

**Tilgangur**: Flýtival fyrir algengar íslenskar áskriftir.

**Ábyrgð**:
- Sýna lista af algengum áskriftum
- Leita/sía valkosti
- Bæta við áskrift með einum smelli
- Leyfa breytingu á verði áður en vistað er

**Opinbert viðmót**:
```typescript
interface QuickAddPresetsProps {
  onSelect: (preset: Omit<Subscription, 'id' | 'isActive'>) => void;
}
```

**Framkvæmdaatriði**:
- Dropdown eða modal með lista
- Flokkar (accordion): Streymi, Hugbúnaður, Líkamsrækt, o.s.frv.
- Leitarreit til að finna hratt
- Notað `COMMON_SUBSCRIPTIONS` frá subscriptions.ts
- Eftir val → opna SubscriptionForm með forstilltum gildum

---

#### 6. CategoryBreakdown

**Tilgangur**: Sýnir sundurliðun eftir flokkum með myndrænni framsetning.

**Ábyrgð**:
- Sýna hvern flokk með samtölu
- Raðað eftir kostnaði (hæst fyrst)
- Sýna prósentu af heildarkostnaði
- Fjöldi áskrifta í hverjum flokki

**Opinbert viðmót**:
```typescript
interface CategoryBreakdownProps {
  breakdown: SubscriptionSummary['byCategory'];
  totalMonthly: number;
}
```

**Framkvæmdaatriði**:
- Horizontal bar chart eða einföld lista
- Litakóðun eftir flokkum (samræmi við flokkalitina)
- Sýna bæði ISK upphæð og prósentu

---

#### 7. FutureValueDisplay

**Tilgangur**: Sýnir framtíðarverðmæti ef áskriftakostnaður væri fjárfestur í staðinn.

**Ábyrgð**:
- Sýna 10 ára og 20 ára framtíðarverðmæti
- Skýr texti um forsendur (7% ávöxtun)
- Aðgengilegt með tooltip fyrir útskýringu

**Opinbert viðmót**:
```typescript
interface FutureValueDisplayProps {
  futureValueIn10Years: number;
  futureValueIn20Years: number;
  monthlyAmount: number;
}
```

**Framkvæmdaatriði**:
- Card með áhrifaríku sniði (highlight)
- Tooltip eða infobox: "Miðað við 7% ársávöxtun með mánaðarlegum innborgunum"
- Sýna samanburð: "Þetta jafngildir X mánaðar launum" (ef actualHourlyWage þekkt)

---

### UI íhlutir (endurnýttir)

Nota sömu grunnviðmót og aðalreiknivélin fyrir samkvæmni:

- **Button**: Aðgerðir (bæta við, vista, hætta við)
- **Input**: Textareitir (nafn, verð)
- **Select**: Valmynd fyrir flokk
- **Card**: Kort fyrir hópun efnis
- **Toggle/Switch**: Til að virkja/afvirkja áskrift
- **Modal**: Fyrir eyðublöð og staðfestingar

## Gagnalíkön

### Kjarnabreytingar (Þegar útfært)

Allar tegundir eru þegar skilgreindar í `src/types/calculator.ts`.

#### Subscription

```typescript
/**
 * Einstök áskrift
 */
export interface Subscription {
  id: string;                        // Einstakt auðkenni (generað)
  name: string;                      // Heiti áskriftar (t.d. "Netflix")
  monthlyCost: number;               // Mánaðarlegur kostnaður í ISK
  category: SubscriptionCategory;    // Flokkur
  isActive: boolean;                 // Hvort áskriftin er virk (talinn með í útreikningum)
}
```

**Staðfestingarreglur**:
- `name`: Ekki tómt, hámark 100 stafir
- `monthlyCost`: Verður að vera > 0
- `category`: Einn af 6 gildum flokkunum
- `isActive`: Boolean (sjálfgefið `true`)

---

#### SubscriptionCategory

```typescript
/**
 * Flokkar fyrir áskriftir
 */
export type SubscriptionCategory =
  | 'streaming'   // Streymi (Netflix, Spotify, o.s.frv.)
  | 'software'    // Hugbúnaður (iCloud, Microsoft 365, o.s.frv.)
  | 'fitness'     // Líkamsrækt (World Class, Fítness, o.s.frv.)
  | 'news'        // Fréttir og tímarit
  | 'gaming'      // Tölvuleikir (PlayStation Plus, o.s.frv.)
  | 'other';      // Annað
```

**Íslensku merki** (í `subscriptions.ts`):
```typescript
export const SUBSCRIPTION_CATEGORY_LABELS: Record<SubscriptionCategory, string> = {
  streaming: 'Streymi',
  software: 'Hugbúnaður',
  fitness: 'Líkamsrækt',
  news: 'Fréttir og tímarit',
  gaming: 'Tölvuleikir',
  other: 'Annað',
};
```

---

#### SubscriptionSummary

```typescript
/**
 * Samantekt á áskriftum með útreikningum
 */
export interface SubscriptionSummary {
  totalMonthly: number;              // Heildar mánaðarkostnaður (aðeins virkar)
  totalYearly: number;               // Heildar árskostnaður
  lifeEnergyHoursPerMonth: number;   // Lífsorku klukkustundir á mánuði
  lifeEnergyHoursPerYear: number;    // Lífsorku klukkustundir á ári
  futureValueIn10Years: number;      // Framtíðarverðmæti eftir 10 ár (7% ávöxtun)
  futureValueIn20Years: number;      // Framtíðarverðmæti eftir 20 ár (7% ávöxtun)
  byCategory: {                      // Sundurliðun eftir flokkum
    category: SubscriptionCategory;
    label: string;                   // Íslenskt heiti
    totalMonthly: number;            // Samtala í þessum flokki
    count: number;                   // Fjöldi áskrifta í flokki
  }[];
}
```

**Útreikningur**:
- Gerð af `calculateSubscriptionSummary()` í `lib/calculations/subscriptions.ts`
- Keyrir sjálfkrafa í `useMemo` hook þegar áskriftir eða `actualHourlyWage` breytast
- Skilar alltaf gildu summary, jafnvel ef engar áskriftir (öll gildi = 0)

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
  subscriptions: Subscription[];     // Áskriftalistinn (NÝTT)
  lastUpdated: string;               // ISO dagsetning
}
```

---

### Sjálfgefin gildi

```typescript
// lib/defaults.ts (bæta við)

export const DEFAULT_SUBSCRIPTION: Omit<Subscription, 'id'> = {
  name: '',
  monthlyCost: 0,
  category: 'other',
  isActive: true,
};
```

---

### Algengar áskriftir (Forstillingar)

Skilgreint í `lib/calculations/subscriptions.ts`:

```typescript
export const COMMON_SUBSCRIPTIONS: Omit<Subscription, 'id' | 'isActive'>[] = [
  // Streymi
  { name: 'Netflix', monthlyCost: 2290, category: 'streaming' },
  { name: 'Spotify', monthlyCost: 1399, category: 'streaming' },
  { name: 'Disney+', monthlyCost: 1290, category: 'streaming' },
  { name: 'HBO Max', monthlyCost: 1790, category: 'streaming' },
  { name: 'Amazon Prime', monthlyCost: 990, category: 'streaming' },
  { name: 'YouTube Premium', monthlyCost: 1590, category: 'streaming' },
  { name: 'Apple TV+', monthlyCost: 990, category: 'streaming' },
  { name: 'Síminn Sport', monthlyCost: 2990, category: 'streaming' },

  // Hugbúnaður
  { name: 'iCloud', monthlyCost: 149, category: 'software' },
  { name: 'Google One', monthlyCost: 299, category: 'software' },
  { name: 'Microsoft 365', monthlyCost: 1099, category: 'software' },
  { name: 'Adobe Creative Cloud', monthlyCost: 7990, category: 'software' },
  { name: 'Dropbox', monthlyCost: 1599, category: 'software' },

  // Líkamsrækt
  { name: 'World Class', monthlyCost: 9990, category: 'fitness' },
  { name: 'Fítness', monthlyCost: 6990, category: 'fitness' },
  { name: 'Strava', monthlyCost: 990, category: 'fitness' },

  // Fréttir
  { name: 'Morgunblaðið', monthlyCost: 3990, category: 'news' },
  { name: 'Vísir Premium', monthlyCost: 1990, category: 'news' },
  { name: 'DV', monthlyCost: 2490, category: 'news' },
  { name: 'The Reykjavik Grapevine', monthlyCost: 990, category: 'news' },

  // Tölvuleikir
  { name: 'PlayStation Plus', monthlyCost: 1290, category: 'gaming' },
  { name: 'Xbox Game Pass', monthlyCost: 1490, category: 'gaming' },
  { name: 'Nintendo Switch Online', monthlyCost: 490, category: 'gaming' },
];
```

**Athugasemd**: Verð eru dæmigerð gildi frá janúar 2025 og gætu þurft uppfærslu.

## Villumeðhöndlun

### Inntaksstaðfesting

```typescript
// lib/utils/validators.ts (bæta við)

/**
 * Staðfesta áskriftarinnslátt
 */
export function validateSubscription(
  subscription: Omit<Subscription, 'id'>
): ValidationResult {
  const errors: Record<string, string> = {};

  // Nafn
  if (!subscription.name || subscription.name.trim() === '') {
    errors['name'] = 'Nafn má ekki vera tómt';
  }
  if (subscription.name.length > 100) {
    errors['name'] = 'Nafn má ekki vera lengra en 100 stafir';
  }

  // Kostnaður
  if (subscription.monthlyCost <= 0) {
    errors['monthlyCost'] = 'Kostnaður verður að vera hærri en 0 kr';
  }
  if (isNaN(subscription.monthlyCost)) {
    errors['monthlyCost'] = 'Kostnaður verður að vera tala';
  }
  if (subscription.monthlyCost > 1000000) {
    errors['monthlyCost'] = 'Kostnaður virðist óraunhæfur (> 1.000.000 kr)';
  }

  // Flokkur
  const validCategories: SubscriptionCategory[] = [
    'streaming',
    'software',
    'fitness',
    'news',
    'gaming',
    'other',
  ];
  if (!validCategories.includes(subscription.category)) {
    errors['category'] = 'Ógildur flokkur';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
```

### Villutilvik og svör

#### 1. Vantar raunverulegt tímakaup

**Ástand**: Notandi opnar Áskriftakostnaðarmælir en hefur ekki fyllt út Tímakaups reiknivélina.

**Greining**: `results?.actualHourlyWage` er `undefined` eða `0`

**Svar**:
- Sýna viðvörunarbox í SubscriptionBurnMeter:
  ```
  ⚠️ Til að sjá lífsorku kostnað þarftu að fylla fyrst út
     Raunverulega Tímakaups reiknivélina hér að ofan.
  ```
- Sýna samt ISK upphæðir (totalMonthly, totalYearly)
- Fela lífsorku gildi (lifeEnergyHours)
- Leyfa samt að bæta við áskriftum

**Notendaboð**: "Fylltu fyrst út Tímakaups reiknivélina til að sjá lífsorku kostnað"

**Logging**: Ekkert (venjuleg notkun)

**Endurheimt**: Notandi fyllir út Tímakaups reiknivélina → lífsorka gildi birtast sjálfkrafa

---

#### 2. Ógilt inntak í eyðublaði

**Ástand**: Notandi reynir að vista áskrift með ógildri gögnum.

**Greining**: `validateSubscription()` skilar `isValid: false`

**Svar**:
- Sýna villuboð við viðkomandi reit:
  - Nafn tómt: "Nafn má ekki vera tómt"
  - Kostnaður ≤ 0: "Kostnaður verður að vera hærri en 0 kr"
  - Kostnaður ekki tala: "Kostnaður verður að vera tala"
- Merkja villureit með rauðum ramma
- Hindra vistun þar til villur eru lagaðar
- Sýna villuyfirlit efst í eyðublaði ef margar villur

**Notendaboð**: Sértæk villuboð við hvern reit

**Logging**: `console.warn('Validation failed:', errors)`

**Endurheimt**: Notandi leiðréttir innslættinn → villur hverfa

---

#### 3. localStorage fullt/ekki tiltækt

**Ástand**: localStorage er fullt eða slökkt (privacy mode).

**Greining**: `safeSetItem()` skilar `false`

**Svar**:
- Sýna toast tilkynningu: "Ekki tókst að vista. Prófaðu að flytja út gögnin þín."
- Halda gögnum í minni (state) þangað til síða er endurhlaðin
- Bjóða upp á export virkni
- Ef localStorage virkar ekki → sýna varanleg viðvörun efst

**Notendaboð**: "Vistun mistókst. Vinsamlegast flettu út gögnunum áður en þú lokar glugganum."

**Logging**: `console.error('localStorage full or unavailable:', error)`

**Endurheimt**: Notandi flytur út gögn eða eyðir gömlum gögnum

---

#### 4. Eyðing áskriftar fyrir slysni

**Ástand**: Notandi smellir á eyða takkann.

**Greining**: `onDelete(id)` kallað

**Svar**:
- Sýna staðfestingardialog:
  ```
  Eyða áskrift?

  Ertu viss um að þú viljir eyða "[subscription.name]"?
  Þessa aðgerð er ekki hægt að afturkalla.

  [Hætta við]  [Eyða]
  ```
- Eyða aðeins ef notandi staðfestir
- Sýna toast tilkynningu eftir eyðingu: "[nafn] hefur verið eytt"

**Notendaboð**: Staðfestingardialog

**Logging**: `console.log('Subscription deleted:', id)`

**Endurheimt**: Engin (eyðing er varanleg) - mætti bæta við "Undo" ef þörf

---

#### 5. Import rangra gagna

**Ástand**: Notandi reynir að flytja inn skrá sem er ekki gilt JSON eða hefur ranga uppbyggingu.

**Greining**: JSON.parse() kastar villu eða version samræmist ekki

**Svar**:
- Sýna villuboð í modal:
  - Ef ekki JSON: "Skráin er ekki gild. Vinsamlegast veldu .json skrá sem var flutt út úr þessu forriti."
  - Ef röng útgáfa: "Skráin er frá eldri útgáfu. Vinsamlegast flyttu út aftur frá nýjustu útgáfu."
- Hafna innflutningi
- Halda núverandi gögnum óbreyttum

**Notendaboð**: Sértæk villuboð eftir villugerð

**Logging**: `console.error('Import failed:', error)`

**Endurheimt**: Notandi velur rétta skrá

---

### Villuboð á íslensku

Öll villuboð sýnd á íslensku:

```typescript
// lib/constants/errorMessages.ts (nýtt)

export const ERROR_MESSAGES = {
  // Staðfesting
  REQUIRED_FIELD: 'Þessi reitur má ekki vera tómur',
  INVALID_NUMBER: 'Verður að vera gild tala',
  INVALID_AMOUNT: 'Upphæð verður að vera hærri en 0',
  NAME_TOO_LONG: 'Nafn má ekki vera lengra en 100 stafir',

  // Kerfisvillur
  STORAGE_FULL: 'Vistun mistókst. Flettu út gögnunum og reyndu aftur.',
  STORAGE_UNAVAILABLE: 'Geymsla er ekki tiltæk í þessum vafra.',

  // Import/Export
  IMPORT_INVALID_FILE: 'Skráin er ekki gild. Veldu .json skrá.',
  IMPORT_VERSION_MISMATCH: 'Skráin er frá eldri útgáfu. Flettu út aftur.',
  EXPORT_FAILED: 'Ekki tókst að flytja út gögn.',

  // Áskriftir
  NO_WAGE_CALCULATED: 'Fylltu fyrst út Tímakaups reiknivélina',
  DELETE_CONFIRMATION: 'Ertu viss um að þú viljir eyða þessari áskrift?',
};
```

### Logging stefna

**Framleiðsla (Production)**:
- Aðeins `console.error` fyrir alvarlegar villur
- Engin PII (persónugreinanlegar upplýsingar) í logs
- Nota error tracking þjónustu (t.d. Sentry) í framtíðinni

**Þróun (Development)**:
- `console.log` fyrir allar aðgerðir
- `console.warn` fyrir staðfestingarvillur
- `console.error` fyrir kerfisvillur

## Prófunarstefna

### Einingarprófanir (Unit Tests)

**Markmið**: Prófa einstakar aðferðir/föll í einangrun.

#### Útreikningsföll (subscriptions.ts)

```typescript
describe('calculateFutureValue', () => {
  it('ætti að reikna rétt framtíðarverðmæti fyrir 10 ár', () => {
    const result = calculateFutureValue(1000, 0.07, 10);
    expect(result).toBeCloseTo(173085, 0); // FV formúla
  });

  it('ætti að skila 0 ef mánaðarlegt sparnaður er 0', () => {
    const result = calculateFutureValue(0, 0.07, 10);
    expect(result).toBe(0);
  });

  it('ætti að meðhöndla 0% vexti', () => {
    const result = calculateFutureValue(1000, 0, 10);
    expect(result).toBe(120000); // 1000 * 12 * 10
  });
});

describe('calculateSubscriptionSummary', () => {
  const testSubs: Subscription[] = [
    {
      id: '1',
      name: 'Netflix',
      monthlyCost: 2290,
      category: 'streaming',
      isActive: true,
    },
    {
      id: '2',
      name: 'Spotify',
      monthlyCost: 1399,
      category: 'streaming',
      isActive: true,
    },
    {
      id: '3',
      name: 'Disney+',
      monthlyCost: 1290,
      category: 'streaming',
      isActive: false, // Óvirk
    },
  ];

  it('ætti að telja aðeins virkar áskriftir', () => {
    const summary = calculateSubscriptionSummary(testSubs, 2000);
    expect(summary.totalMonthly).toBe(3689); // Netflix + Spotify
    expect(summary.totalYearly).toBe(44268);
  });

  it('ætti að reikna lífsorku rétt', () => {
    const summary = calculateSubscriptionSummary(testSubs, 2000);
    // 3689 kr / 2000 kr/klst = 1.8445 klst
    expect(summary.lifeEnergyHoursPerMonth).toBeCloseTo(1.8445, 2);
  });

  it('ætti að flokka rétt eftir category', () => {
    const summary = calculateSubscriptionSummary(testSubs, 2000);
    expect(summary.byCategory).toHaveLength(1); // Aðeins streaming
    expect(summary.byCategory[0].category).toBe('streaming');
    expect(summary.byCategory[0].count).toBe(2);
  });

  it('ætti að raða flokkum eftir kostnaði', () => {
    const multiCategorySubs = [
      ...testSubs,
      {
        id: '4',
        name: 'World Class',
        monthlyCost: 9990,
        category: 'fitness' as SubscriptionCategory,
        isActive: true,
      },
    ];
    const summary = calculateSubscriptionSummary(multiCategorySubs, 2000);
    expect(summary.byCategory[0].category).toBe('fitness'); // Hæstur
  });
});
```

#### Staðfesting (validators.ts)

```typescript
describe('validateSubscription', () => {
  it('ætti að samþykkja gilt inntak', () => {
    const sub: Omit<Subscription, 'id'> = {
      name: 'Netflix',
      monthlyCost: 2290,
      category: 'streaming',
      isActive: true,
    };
    const result = validateSubscription(sub);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('ætti að hafna tómu nafni', () => {
    const sub: Omit<Subscription, 'id'> = {
      name: '',
      monthlyCost: 2290,
      category: 'streaming',
      isActive: true,
    };
    const result = validateSubscription(sub);
    expect(result.isValid).toBe(false);
    expect(result.errors['name']).toBeDefined();
  });

  it('ætti að hafna neikvæðum kostnaði', () => {
    const sub: Omit<Subscription, 'id'> = {
      name: 'Test',
      monthlyCost: -100,
      category: 'streaming',
      isActive: true,
    };
    const result = validateSubscription(sub);
    expect(result.isValid).toBe(false);
    expect(result.errors['monthlyCost']).toBeDefined();
  });
});
```

---

### Samþættingarprófanir (Integration Tests)

**Markmið**: Prófa samskipti milli íhluta og Context.

#### Context stjórnun

```typescript
describe('CalculatorContext - Subscriptions', () => {
  it('ætti að bæta við áskrift', () => {
    const { result } = renderHook(() => useCalculator(), {
      wrapper: CalculatorProvider,
    });

    act(() => {
      result.current.addSubscription({
        name: 'Netflix',
        monthlyCost: 2290,
        category: 'streaming',
        isActive: true,
      });
    });

    expect(result.current.subscriptions).toHaveLength(1);
    expect(result.current.subscriptions[0].name).toBe('Netflix');
  });

  it('ætti að uppfæra áskrift', () => {
    const { result } = renderHook(() => useCalculator(), {
      wrapper: CalculatorProvider,
    });

    act(() => {
      result.current.addSubscription({
        name: 'Netflix',
        monthlyCost: 2290,
        category: 'streaming',
        isActive: true,
      });
    });

    const id = result.current.subscriptions[0].id;

    act(() => {
      result.current.updateSubscription(id, { monthlyCost: 2490 });
    });

    expect(result.current.subscriptions[0].monthlyCost).toBe(2490);
  });

  it('ætti að eyða áskrift', () => {
    const { result } = renderHook(() => useCalculator(), {
      wrapper: CalculatorProvider,
    });

    act(() => {
      result.current.addSubscription({
        name: 'Netflix',
        monthlyCost: 2290,
        category: 'streaming',
        isActive: true,
      });
    });

    const id = result.current.subscriptions[0].id;

    act(() => {
      result.current.deleteSubscription(id);
    });

    expect(result.current.subscriptions).toHaveLength(0);
  });

  it('ætti að toggle áskrift', () => {
    const { result } = renderHook(() => useCalculator(), {
      wrapper: CalculatorProvider,
    });

    act(() => {
      result.current.addSubscription({
        name: 'Netflix',
        monthlyCost: 2290,
        category: 'streaming',
        isActive: true,
      });
    });

    const id = result.current.subscriptions[0].id;

    act(() => {
      result.current.toggleSubscription(id);
    });

    expect(result.current.subscriptions[0].isActive).toBe(false);
  });

  it('ætti að uppfæra subscriptionSummary þegar áskriftum breytt', () => {
    const { result } = renderHook(() => useCalculator(), {
      wrapper: CalculatorProvider,
    });

    // Setja actualHourlyWage fyrst
    act(() => {
      result.current.updateIncome({ grossAnnualIncome: 6000000 });
    });

    act(() => {
      result.current.addSubscription({
        name: 'Netflix',
        monthlyCost: 2290,
        category: 'streaming',
        isActive: true,
      });
    });

    expect(result.current.subscriptionSummary?.totalMonthly).toBe(2290);
  });
});
```

#### localStorage vistun/hleðsla

```typescript
describe('Subscription localStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('ætti að vista áskriftir í localStorage', async () => {
    const { result } = renderHook(() => useCalculator(), {
      wrapper: CalculatorProvider,
    });

    act(() => {
      result.current.addSubscription({
        name: 'Netflix',
        monthlyCost: 2290,
        category: 'streaming',
        isActive: true,
      });
    });

    // Bíða eftir debounce (500ms)
    await waitFor(() => {
      const stored = localStorage.getItem('life-energy-calculator');
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored!);
      expect(parsed.subscriptions).toHaveLength(1);
    });
  });

  it('ætti að hlaða áskriftum úr localStorage', () => {
    const storedState: StoredState = {
      version: 1,
      currentInputs: DEFAULT_INPUTS,
      scenarios: [],
      subscriptions: [
        {
          id: 'test-1',
          name: 'Netflix',
          monthlyCost: 2290,
          category: 'streaming',
          isActive: true,
        },
      ],
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem('life-energy-calculator', JSON.stringify(storedState));

    const { result } = renderHook(() => useCalculator(), {
      wrapper: CalculatorProvider,
    });

    expect(result.current.subscriptions).toHaveLength(1);
    expect(result.current.subscriptions[0].name).toBe('Netflix');
  });
});
```

---

### Íhlutaprófanir (Component Tests)

**Markmið**: Prófa að íhlutir birta gögn rétt og bregðast við notendaaðgerðum.

#### SubscriptionBurnMeter

```typescript
describe('SubscriptionBurnMeter', () => {
  it('ætti að sýna viðvörun ef actualHourlyWage vantar', () => {
    render(
      <CalculatorProvider>
        <SubscriptionBurnMeter />
      </CalculatorProvider>
    );

    expect(screen.getByText(/Fylltu fyrst út/i)).toBeInTheDocument();
  });

  it('ætti að sýna samtölur rétt', () => {
    // Mock Context með áskriftum og actualHourlyWage
    const { result } = renderHook(() => useCalculator(), {
      wrapper: CalculatorProvider,
    });

    act(() => {
      result.current.updateIncome({ grossAnnualIncome: 6000000 });
      result.current.addSubscription({
        name: 'Netflix',
        monthlyCost: 2290,
        category: 'streaming',
        isActive: true,
      });
    });

    render(
      <CalculatorProvider>
        <SubscriptionBurnMeter />
      </CalculatorProvider>
    );

    expect(screen.getByText(/2\.290 kr/i)).toBeInTheDocument();
  });
});
```

#### SubscriptionForm

```typescript
describe('SubscriptionForm', () => {
  it('ætti að sýna villuboð fyrir ógilt inntak', async () => {
    const onSave = jest.fn();
    render(<SubscriptionForm mode="add" onSave={onSave} onCancel={() => {}} />);

    const saveButton = screen.getByText(/Vista/i);
    fireEvent.click(saveButton);

    expect(await screen.findByText(/Nafn má ekki vera tómt/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('ætti að vista gilt inntak', async () => {
    const onSave = jest.fn();
    render(<SubscriptionForm mode="add" onSave={onSave} onCancel={() => {}} />);

    fireEvent.change(screen.getByLabelText(/Nafn/i), {
      target: { value: 'Netflix' },
    });
    fireEvent.change(screen.getByLabelText(/Kostnaður/i), {
      target: { value: '2290' },
    });
    fireEvent.change(screen.getByLabelText(/Flokkur/i), {
      target: { value: 'streaming' },
    });

    const saveButton = screen.getByText(/Vista/i);
    fireEvent.click(saveButton);

    expect(onSave).toHaveBeenCalledWith({
      name: 'Netflix',
      monthlyCost: 2290,
      category: 'streaming',
      isActive: true,
    });
  });
});
```

---

### End-to-End prófanir (E2E)

**Markmið**: Prófa heildarflæði notenda.

**Tól**: Playwright eða Cypress

#### Flæði: Bæta við áskrift og sjá lífsorku

```typescript
test('Notandi getur bætt við áskrift og séð lífsorku kostnað', async ({
  page,
}) => {
  await page.goto('/');

  // 1. Fylla út tímakaups reiknivélina
  await page.fill('input[name="grossAnnualIncome"]', '6000000');
  await page.fill('input[name="workHoursPerWeek"]', '40');

  // 2. Fara í áskriftamælir
  await page.click('text=Áskriftakostnaðarmælir');

  // 3. Bæta við áskrift
  await page.click('text=Bæta við áskrift');
  await page.fill('input[name="name"]', 'Netflix');
  await page.fill('input[name="monthlyCost"]', '2290');
  await page.selectOption('select[name="category"]', 'streaming');
  await page.click('button:has-text("Vista")');

  // 4. Staðfesta að áskrift birtist
  await expect(page.locator('text=Netflix')).toBeVisible();

  // 5. Staðfesta að lífsorka birtist
  await expect(page.locator('text=/\\d+,?\\d* klst/i')).toBeVisible();

  // 6. Staðfesta að FI áhrif birtist
  await expect(page.locator('text=/Eftir 10 ár/i')).toBeVisible();
});
```

#### Flæði: Toggle áskrift

```typescript
test('Notandi getur slökkt á áskrift', async ({ page }) => {
  // Setup með áskrift
  await page.goto('/');
  // ... bæta við áskrift ...

  // Smella á toggle rofa
  await page.click('[data-testid="subscription-toggle-1"]');

  // Staðfesta að heildarupphæð minnkaði
  const totalBefore = await page.textContent('[data-testid="total-monthly"]');
  await expect(page.locator('text=Óvirk')).toBeVisible();
  const totalAfter = await page.textContent('[data-testid="total-monthly"]');
  expect(totalBefore).not.toBe(totalAfter);
});
```

---

### Prófunarsviðsmörk

**Þekking (Coverage)**:
- Markmið: > 80% fyrir útreikningsföll
- Markmið: > 70% fyrir íhluti
- Markmið: > 60% heildarþekking

**Forgangsröðun**:
1. **Krítískir stígar**: Útreikningar, staðfesting, vistun
2. **Meðal**: Íhlutavirkni, villumeðhöndlun
3. **Lág**: Edge cases, útlitsatriði

**Framkvæmdatími**:
- Einingarprófanir: < 5 sek
- Samþættingar: < 15 sek
- E2E: < 2 mín

**CI/CD samþætting**:
- Keyra allar prófanir á hverju pull request
- Blokka merge ef prófanir bila
- Keyra E2E aðeins á main branch

## Hönnunarákvarðanir

### Ákvörðun 1: Samþætting með núverandi Context

**Samhengi**: Áskriftakostnaðarmælirinn þarf aðgang að `actualHourlyWage` úr aðalreiknivélinni og þarf líka að vista sín eigin gögn.

**Valkostir sem skoðaðir voru**:

1. **Aðskilinn Context fyrir áskriftir**
   - Kostir: Betri aðskilnaður áhyggnuefna, auðveldara að prófa
   - Gallar: Þarf samskiptalög milli tveggja Context, flóknara, tvöföldun á localStorage kóða
   - Áhætta: Sync vandamál milli tveggja Context

2. **Samþætting í núverandi CalculatorContext** (VALIÐ)
   - Kostir: Ein heimild sannleikans, sjálfvirk uppfærsla þegar actualHourlyWage breytist, sameiginleg localStorage stjórnun
   - Gallar: CalculatorContext verður stærri, meira ábyrgðarsvið
   - Áhætta: Minni, þar sem ábyrgðarsviðin eru nátengd

**Ákvörðun**: Samþætta í núverandi CalculatorContext

**Rökstuðningur**:
- Áskriftamælirinn er ekki sjálfstæð virkni - hann *þarf* actualHourlyWage
- Gögn eiga að flæða eðlilega: tekjur → actualHourlyWage → áskriftir → lífsorka
- Ein localStorage vistun fyrir öll gögn einfaldar export/import
- Ef Context verður of stór má síðar refactor-a með reducer pattern

**Afleiðingar**:
- CalculatorContext fær nýjar aðferðir: `addSubscription`, `updateSubscription`, `deleteSubscription`, `toggleSubscription`
- `StoredState` interface uppfært til að innihalda `subscriptions: Subscription[]`
- Bætt `subscriptionSummary` við Context sem derived state (useMemo)

**Kröfur sem þetta uppfyllir**: NS-1, NS-2, NS-5

---

### Ákvörðun 2: Toggle frekar en eyða

**Samhengi**: Notendur vilja oft sjá "hvað ef" sviðsmyndir - t.d. "hvað ef ég segði Netflix upp?"

**Valkostir sem skoðaðir voru**:

1. **Aðeins eyða virkni**
   - Kostir: Einfaldara, færri stöður
   - Gallar: Notandi verður að endurskrá áskrift til að bera saman
   - Áhætta: Leiðinleg notendaupplifun

2. **Toggle virkni (isActive flag)** (VALIÐ)
   - Kostir: Óeyðandi samanburður, auðvelt að endurvirkja
   - Gallar: Örlítið flóknara gagnalíkan
   - Áhætta: Lítil - mjög algengt pattern

**Ákvörðun**: Bæta við `isActive: boolean` flag

**Rökstuðningur**:
- Uppfyllir NS-5 beint: "bera saman útgáfur"
- Samræmist "sperrsamt" hugmyndafræði YMOYL - hjálpa notendum að sjá raunverulegan kostnað
- Engin netbeiðni þýðir að toggle er samstundis (góð UX)
- Óvirkar áskriftir sýndar grátt gefur góða myndræna endurgjöf

**Afleiðingar**:
- Allir útreikningar nota `.filter(s => s.isActive)` áður en teljið
- Viðmót þarf að sýna óvirkar áskriftir með skýrum hætti
- Toggle takki við hverja áskrift
- Mögulega sýna "Samanburðar" glugga: "Þú gætir sparað X kr með því að slökkva á óvirkum áskriftum"

**Kröfur sem þetta uppfyllir**: NS-5

---

### Ákvörðun 3: 7% ársávöxtun fyrir FI áhrif

**Samhengi**: Til að reikna framtíðarverðmæti þurfum við að velja áætlaða ávöxtun.

**Valkostir sem skoðaðir voru**:

1. **Breytanleg ávöxtunarprósentaa notanda**
   - Kostir: Sveigjanleiki, notandi getur notað sínar eigin forsendur
   - Gallar: Flóknara UI, gæti ruglað nýliða
   - Áhætta: Óraunhæfar væntingar ef notandi setur of háa prósentu

2. **Fast 7% gildi** (VALIÐ)
   - Kostir: Einfalt, vel þekkt viðmið (S&P 500 sögulegt meðaltal), samræmist FIRE samfélagsviðmiðum
   - Gallar: Ekki nákvæmt fyrir alla markaði/tímabil
   - Áhætta: Lítil - skýrlega merkt sem "áætlað"

3. **Margir valkostir (íhaldssamt 4%, meðal 7%, bjartsýnt 10%)**
   - Kostir: Gefur svið, fræðir notendur
   - Gallar: Tekur meira pláss, of miklar upplýsingar
   - Áhætta: Miðlungs - gæti valdið "analysis paralysis"

**Ákvörðun**: Fast 7% með skýrum fyrirvara

**Rökstuðningur**:
- 7% er viðurkenndur staðall í FIRE/FI samfélaginu
- Einfaldar MVP - getum bætt við sveigjanlegu síðar ef þörf
- Sýnir skýrt í UI: "Miðað við 7% ársávöxtun" með tooltip útskýringu
- Samræmist "Your Money or Your Life" bókinni

**Afleiðingar**:
- Föst `annualReturnRate = 0.07` í `calculateSubscriptionSummary()`
- UI inniheldur disclaimer: "Miðað við 7% ársávöxtun með mánaðarlegum innborgunum"
- Tooltip útskýrir: "7% er sögulegt meðaltal S&P 500 hlutabréfavísitölu, leiðrétt fyrir verðbólgu"
- Framtíðarendurbót: Bæta við stillingu ef notendur óska

**Kröfur sem þetta uppfyllir**: NS-3

---

### Ákvörðun 4: Flýtival (Quick Add) útfærsla

**Samhengi**: Flestir Íslendingar hafa svipaðar áskriftir (Netflix, Spotify, o.s.frv.). Handvirk innsláttur er leiðinlegur.

**Valkostir sem skoðaðir voru**:

1. **Dropdown með API kalli til að sækja verð**
   - Kostir: Alltaf uppfært verð
   - Gallar: Krefst backend, ekki í samræmi við client-only arkitektúr, tafir
   - Áhætta: Há - bætir flækjustigi, kostnaði, privacy áhyggjum

2. **Harðkóðaður listi með föstum verðum** (VALIÐ)
   - Kostir: Engar netbeiðnir, samstundis, samræmist núverandi arkitektúr
   - Gallar: Verð úrelt ef áskriftir hækka, krefst handvirkrar uppfærslu
   - Áhætta: Lítil - notandi getur breytt verði áður en vistað

3. **Scraped gögn sem uppfærð reglulega í build time**
   - Kostir: Uppfærð gögn án runtime API
   - Gallar: Flókið build setup, lagalegar áhyggjur með scraping
   - Áhætta: Há - viðhald og lagalegheit

**Ákvörðun**: Harðkóðaður listi í `COMMON_SUBSCRIPTIONS`

**Rökstuðningur**:
- Uppfyllir MVP þarfir (NS-6) án þess að flækja
- Notandi getur alltaf breytt verði ef það er rangt
- Hægt að uppfæra listann með nýjum release
- Engar privacy áhyggjur - engin gögn send á netþjón
- Verð eru dæmigerð og gefa gott upphafspunkt

**Afleiðingar**:
- `COMMON_SUBSCRIPTIONS` array í `subscriptions.ts` með ~25 algengum áskriftum
- Athugasemd í kóða: "Verð frá janúar 2025, uppfæra reglulega"
- QuickAddPresets íhlutur leyfir breytingu á verði áður en vistað
- Framtíð: Bæta við "Tilkynna um rangt verð" link

**Kröfur sem þetta uppfyllir**: NS-6

---

### Ákvörðun 5: Flokkakerfið (6 flokkar)

**Samhengi**: Notendur þurfa að sjá hvar þeir eyða mestu. Of margir flokkar rugla, of fáir eru ekki gagnlegir.

**Valkostir sem skoðaðir voru**:

1. **Einn "annað" flokkur**
   - Kostir: Einfaldast
   - Gallar: Ekki gagnlegt fyrir greiningu
   - Áhætta: Uppfyllir ekki NS-4

2. **Mjög nákvæmur flokkun (15+ flokkar)**
   - Kostir: Mjög ítarleg greining
   - Gallar: Yfirþyrmandi, erfitt að velja flokk
   - Áhætta: Leiðir til "other" notkunar samt

3. **6 algengir flokkar** (VALIÐ)
   - Kostir: Nægir fyrir flestar áskriftir, auðvelt að velja, skýr merking
   - Gallar: Sumar áskriftir passa ekki fullkomlega
   - Áhætta: Lítil - "other" fangar allt annað

**Ákvörðun**: 6 flokkar - streaming, software, fitness, news, gaming, other

**Rökstuðningur**:
- Nær yfir 90%+ af algengum áskriftum
- Samræmist því hvernig fólk hugsar um áskriftir sínar
- Auðvelt að merkja og nota litakóðun
- "Other" veitir sveigjanleika

**Afleiðingar**:
- `SubscriptionCategory` type með 6 gildum
- `SUBSCRIPTION_CATEGORY_LABELS` fyrir íslensku heiti
- Litakóðun í UI (t.d. streaming = blár, fitness = grænn, o.s.frv.)
- Sjálfgefið gildi: `'other'`

**Kröfur sem þetta uppfyllir**: NS-4

---

### Ákvörðun 6: Stílsetning (Tailwind CSS)

**Samhengi**: Þurfum að velja stílsetningu sem samræmist núverandi reiknivél.

**Valkostir sem skoðaðir voru**:

1. **CSS Modules**
   - Kostir: Scoped styles, góð TypeScript stuðningur
   - Gallar: Krefst auka skráa, ekki í samræmi við núverandi

2. **Styled Components**
   - Kostir: Dynamic styling, component-level
   - Gallar: Runtime cost, ekki notað enn, aukið bundle size

3. **Tailwind CSS** (VALIÐ)
   - Kostir: Þegar í notkun, fljótlegt, samræmi við aðalreiknivél, lítið bundle
   - Gallar: Löng class strings
   - Áhætta: Engin - þegar uppsett

**Ákvörðun**: Halda áfram með Tailwind CSS

**Rökstuðningur**:
- Samræmi við núverandi kóða
- Engin ný dependencies
- Utility-first er fljótt fyrir prototyping
- Hægt að auðveldlega deila stílum milli íhluta

**Afleiðingar**:
- Nota sama lit palette og aðalreiknivél
- Búa til sérsniðnar utility classes fyrir áskriftaflokkaliti
- Endurnýta Card, Button, Input íhluti

## Rekjanleiki við kröfur

### NS-1: Skrá áskriftir

**Hönnunarþættir**:

- **Arkitektúr**:
  - `CalculatorContext` með `subscriptions: Subscription[]` array
  - CRUD aðferðir: `addSubscription()`, `updateSubscription()`, `deleteSubscription()`

- **Íhlutir**:
  - `SubscriptionForm` - eyðublað með nafn, kostnaður, flokkur
  - `SubscriptionList` - sýnir allar skráðar áskriftir
  - `SubscriptionItem` - einstök áskrift með breyta/eyða hnöppum

- **Gagnalíkön**:
  - `Subscription` interface með validation reglum
  - `validateSubscription()` staðfestir öll inntök

- **Prófanir**:
  - Einingarprófun á `validateSubscription()`
  - Samþættingarprófun á Context CRUD aðgerðum
  - E2E próf á fullu flæði: bæta við → vista → sjá í lista

---

### NS-2: Sjá lífsorku kostnað

**Hönnunarþættir**:

- **Arkitektúr**:
  - `subscriptionSummary` í Context sem useMemo hook
  - Notar `results.actualHourlyWage` úr aðalreiknivél
  - `calculateSubscriptionSummary()` reiknar lífsorku með `dollarsToLifeEnergy()`

- **Íhlutir**:
  - `SubscriptionBurnMeter` - sýnir heildaryfirlit með lífsorku
  - Sýnir viðvörun ef `actualHourlyWage` vantar

- **Gagnalíkön**:
  - `SubscriptionSummary.lifeEnergyHoursPerMonth`
  - `SubscriptionSummary.lifeEnergyHoursPerYear`

- **Prófanir**:
  - Einingarprófun á lífsorku útreikningum
  - Íhlutar próf staðfestir að lífsorka birtist rétt
  - E2E próf staðfestir samþættingu við aðalreiknivél

---

### NS-3: Sjá áhrif á fjárhagslegt frelsi (FI)

**Hönnunarþættir**:

- **Arkitektúr**:
  - `calculateFutureValue()` notar samsett vaxtaformúlu
  - Fast 7% ársávöxtun (Hönnunarákvörðun #3)

- **Íhlutir**:
  - `FutureValueDisplay` - sýnir 10 ár og 20 ár verðmæti
  - Tooltip útskýrir forsendur (7% ávöxtun)

- **Gagnalíkön**:
  - `SubscriptionSummary.futureValueIn10Years`
  - `SubscriptionSummary.futureValueIn20Years`

- **Prófanir**:
  - Einingarprófun á `calculateFutureValue()` með þekktum gildum
  - Íhlutar próf staðfestir birtingu

---

### NS-4: Flokka áskriftir

**Hönnunarþættir**:

- **Arkitektúr**:
  - 6 flokkar: streaming, software, fitness, news, gaming, other
  - `byCategory` array í SubscriptionSummary raðað eftir kostnaði

- **Íhlutir**:
  - `CategoryBreakdown` - sýnir samtölur og fjölda í hverjum flokki
  - `SubscriptionList` - flokkun og raðað sýning

- **Gagnalíkön**:
  - `SubscriptionCategory` type
  - `SUBSCRIPTION_CATEGORY_LABELS` fyrir íslensku heiti
  - `byCategory` í SubscriptionSummary

- **Prófanir**:
  - Einingarprófun á flokkunar rökfræði
  - Staðfesta röðun (hæstur fyrst)

---

### NS-5: Kveikja/slökkva á áskriftum

**Hönnunarþættir**:

- **Arkitektúr**:
  - `isActive: boolean` flag á Subscription
  - `toggleSubscription()` í Context
  - Allir útreikningar nota `.filter(s => s.isActive)`

- **Íhlutir**:
  - `SubscriptionItem` - toggle rofi
  - Óvirkar áskriftir sýndar gráar með "Óvirk" merki

- **Gagnalíkön**:
  - `Subscription.isActive` (sjálfgefið `true`)

- **Villumeðhöndlun**:
  - Engin staðfesting þarf fyrir toggle (afturkræft)

- **Prófanir**:
  - Samþættingarprófun á toggle virkni
  - E2E próf staðfestir að samtölur uppfærast

---

### NS-6: Flýtival fyrir algengar áskriftir

**Hönnunarþættir**:

- **Arkitektúr**:
  - `COMMON_SUBSCRIPTIONS` array með ~25 algengum áskriftum
  - Harðkóðuð verð (Hönnunarákvörðun #4)

- **Íhlutir**:
  - `QuickAddPresets` - dropdown/modal með lista
  - Leitarreitur til að sía
  - Flokkaðar eftir category (accordion)
  - Leyfa verðbreytingu áður en vistað

- **Gagnalíkön**:
  - `COMMON_SUBSCRIPTIONS: Omit<Subscription, 'id' | 'isActive'>[]`

- **Prófanir**:
  - Íhlutar próf á val og vistun
  - E2E próf á flæði: flýtival → breyta verði → vista

---

### Kröfur sem ekki tengjast virkni

#### Afköst

**Kröfur**:
- Útreikningar < 50ms
- Engar netbeiðnir

**Hönnun**:
- Allir útreikningar eru synchronous JavaScript
- useMemo fyrir caching
- Debounce á localStorage vistun (500ms)
- Einingarprófanir mæla framkvæmdatíma

---

#### Aðgengi (WCAG 2.1 AA)

**Kröfur**:
- Lyklaborðs aðgengi
- Skjálesari samhæft

**Hönnun**:
- Allir íhlutir nota semantic HTML
- ARIA labels á öllum form elementum
- Focus indicators með Tailwind
- Tab order rökrétt
- Live regions fyrir dynamic uppfærslur
- Prófað með skjálesara (VoiceOver/NVDA)

---

#### Persónuvernd

**Kröfur**:
- Engin gögn send á netþjón
- localStorage geymsla
- Export/import virkni

**Hönnun**:
- Client-only arkitektúr (engar API köll)
- `StoredState` inniheldur áskriftir
- Export/import notar JSON blobs (engin server upload)
- Privacy policy skýrir localStorage notkun

---

### Samantekt rekjanleika

| Kröfu ID | Hönnunarþáttur | Staða |
|----------|---------------|-------|
| NS-1 | Context CRUD + SubscriptionForm + validation | ✅ Fullnægjandi |
| NS-2 | calculateSubscriptionSummary + lifeEnergy | ✅ Fullnægjandi |
| NS-3 | calculateFutureValue + FutureValueDisplay | ✅ Fullnægjandi |
| NS-4 | 6 flokkar + CategoryBreakdown | ✅ Fullnægjandi |
| NS-5 | isActive flag + toggleSubscription | ✅ Fullnægjandi |
| NS-6 | COMMON_SUBSCRIPTIONS + QuickAddPresets | ✅ Fullnægjandi |
| Afköst | Sync útreikningar + debounce | ✅ Fullnægjandi |
| Aðgengi | Semantic HTML + ARIA | ✅ Fullnægjandi |
| Persónuvernd | Client-only + localStorage | ✅ Fullnægjandi |

**Niðurstaða**: Hönnunin uppfyllir allar kröfur sem skilgreindar eru í requirements.md.
