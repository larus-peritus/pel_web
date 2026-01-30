# Verkefni: Umönnunar- og Menntakostnaðarreiknivél

## Yfirlit

**Eiginleiki**: Umönnunar- og Menntakostnaðarreiknivél (Childcare & Education Cost Calculator)
**Forrit**: peninganaedalifid.is
**Kröfur**: [requirements.md](./requirements.md)
**Hönnun**: [design.md](./design.md)

## Forsendur

Áður en byrjað er á þessum verkefnum:
- [x] Verkefni er frumstillt (Next.js + React + TypeScript + Tailwind)
- [x] Grunnur UI íhlutir eru til (Input, Button, Card, Select)
- [x] Gagnavarðveislulag er til staðar (localStorage hooks)
- [x] Raunverulegt Tímakaups reiknivél er útfærð (fyrir actualHourlyWage)
- [x] CalculatorContext er til staðar og virkar

## Útfærslurstefna

**Valin stefna**: Foundation-first með feature-slice blöndu

**Rökstuðningur**:
1. Byrja á gagnalíkönum og útreikningum (foundation)
2. Smíða UI íhluti fyrir hvern flokk (feature-slice)
3. Samþætta í aðal reiknivél
4. Bæta við prófunum í hverju skrefi

**Ávinningur**:
- Sterk grunnur tryggir áreiðanleika
- Auðvelt að prófa hvert lag fyrir sig
- Hægt að senda út á framleiðslu stigvaxandi

---

## Epic 1: Grunngerð og gagnalög

**Markmið**: Búa til öll TypeScript tegundir, útreikningsföll og context uppfærslur.

**Áætlaður tími**: 8-10 klst

**Háðir**: Engin

### Verkefni 1.1: Búa til TypeScript týpur

**Staða**: [ ] Ekki byrjað | [ ] Í vinnslu | [ ] Lokið
**Flækjustig**: Einfalt
**Áætlaður tími**: 2 klst

**Lýsing**: Skilgreina allar TypeScript týpur fyrir umönnunar- og menntakostnaðarreiknivélina.

**Skrár til að breyta**:
- `src/types/calculator.ts`

**Útfærsla**:

1. Bæta við `ChildcareCategory` type
```typescript
export type ChildcareCategory =
  | 'daycare'      // Leikskóli
  | 'afterschool'  // Frístund
  | 'activities'   // Tónlistarskóli, íþróttir
  | 'tutoring'     // Einkakennsla
  | 'university';  // Háskólasparnaður
```

2. Bæta við `ChildcareDetails` interface
```typescript
export interface ChildcareDetails {
  daycareType?: 'municipal' | 'private' | 'other';
  summerMonthsActive?: boolean;
  activityType?: string;
  hourlyRate?: number;
  hoursPerMonth?: number;
  currentAge?: number;
  collegeAge?: number;
  costPerYear?: number;
  yearsInCollege?: number;
  expectedReturn?: number;
}
```

3. Bæta við `ChildcareItem` interface
```typescript
export interface ChildcareItem {
  id: string;
  category: ChildcareCategory;
  name: string;
  monthlyCost: number;
  monthsPerYear: number;
  numberOfChildren: number;
  details?: ChildcareDetails;
}
```

4. Bæta við `ChildcareSummary` interface
```typescript
export interface ChildcareSummary {
  totalMonthlyAverage: number;
  totalYearly: number;
  lifeEnergyHoursPerMonth: number;
  lifeEnergyHoursPerYear: number;
  byCategory: {
    category: ChildcareCategory;
    label: string;
    totalYearly: number;
    totalMonthly: number;
    count: number;
  }[];
  universitySavings?: {
    totalCost: number;
    monthsUntilCollege: number;
    monthlyPaymentNeeded: number;
  };
}
```

5. Uppfæra `StoredState` til að innihalda childcareItems
```typescript
export interface StoredState {
  // ... existing fields
  childcareItems: ChildcareItem[];
}
```

**Samþykktarviðmið**:
- [x] Allar týpur útfærðar og útfluttar
- [x] Engar TypeScript villur
- [x] Tegundir samræmast requirements.md
- [x] Jsdoc athugasemdir fyrir allar týpur

**Prófun**:
- TypeScript compiler check: `npm run type-check`

---

### Verkefni 1.2: Útfæra útreikningavél fyrir umönnun

**Staða**: [ ] Ekki byrjað | [ ] Í vinnslu | [ ] Lokið
**Flækjustig**: Miðlungs
**Áætlaður tími**: 4 klst

**Lýsing**: Útfæra hrein útreikningsföll fyrir umönnunar- og menntakostnað.

**Skrár til að búa til**:
- `src/lib/calculations/childcare.ts`

**Útfærsla**:

1. Búa til `CHILDCARE_CATEGORY_LABELS` fyrir íslensku merki
```typescript
export const CHILDCARE_CATEGORY_LABELS: Record<ChildcareCategory, string> = {
  daycare: 'Leikskóli',
  afterschool: 'Frístund',
  activities: 'Tónlistarskóli og tímar',
  tutoring: 'Einkakennsla',
  university: 'Háskólasparnaður',
};
```

2. Útfæra `calculateChildcareSummary()`
```typescript
export function calculateChildcareSummary(
  items: ChildcareItem[],
  actualHourlyWage: number
): ChildcareSummary {
  // Reikna heildarkostnað fyrir hvern lið
  // Flokka eftir category
  // Reikna lífsorku
  // Raða flokkum eftir kostnaði
}
```

3. Útfæra `calculateUniversitySavings()`
```typescript
export function calculateUniversitySavings(
  details: Required<Pick<ChildcareDetails,
    'currentAge' | 'collegeAge' | 'costPerYear' |
    'yearsInCollege' | 'expectedReturn'>>
): {
  totalCost: number;
  monthsUntilCollege: number;
  monthlyPaymentNeeded: number;
} {
  // Reikna heildarkostnað
  // Reikna mánuði þar til
  // Nota FV formúlu fyrir mánaðarlegan sparnað
}
```

4. Útfæra `generateChildcareId()`
```typescript
export function generateChildcareId(): string {
  return `childcare_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
```

5. Búa til `COMMON_CHILDCARE_ITEMS` lista
```typescript
export const COMMON_CHILDCARE_ITEMS: Omit<ChildcareItem, 'id'>[] = [
  // Leikskóli sveitarfélags, einkarekinn
  // Frístund (vetur, heilt ár)
  // Tónlistarskóli, íþróttir, sund, dans
  // Einkakennsla
];
```

**Samþykktarviðmið**:
- [x] calculateChildcareSummary() skilar réttum gildum
- [x] calculateUniversitySavings() notar FV formúlu rétt
- [x] Lífsorku útreikningar nota actualHourlyWage
- [x] Flokkun virkar rétt
- [x] Öll föll eru hrein (engar hliðarverkanir)
- [x] COMMON_CHILDCARE_ITEMS hefur að minnsta kosti 8 liði

**Prófun**:
```typescript
// Dæmi um prófanir
test('reiknar heildarárskostnað rétt með mörgum börnum', () => {});
test('reiknar mánaðarlegan sparnað fyrir háskóla', () => {});
test('meðhöndlar ógildar aldursupplýsingar', () => {});
```

---

### Verkefni 1.3: Uppfæra CalculatorContext fyrir umönnun

**Staða**: [x] Lokið - 2026-01-20
**Flækjustig**: Miðlungs
**Áætlaður tími**: 4 klst

**Lýsing**: Uppfæra CalculatorContext til að styðja umönnunarstjórnun.

**Skrár til að breyta**:
- `src/context/CalculatorContext.tsx`

**Útfærsla**:

1. Uppfæra `CalculatorContextType` með umönnunareiginleikum
```typescript
interface CalculatorContextType {
  // ... existing fields
  childcareItems: ChildcareItem[];
  childcareSummary: ChildcareSummary | null;
  addChildcareItem: (item: Omit<ChildcareItem, 'id'>) => void;
  updateChildcareItem: (id: string, item: Partial<ChildcareItem>) => void;
  deleteChildcareItem: (id: string) => void;
}
```

2. Bæta við `childcareItems` state
```typescript
const [childcareItems, setChildcareItems] = useState<ChildcareItem[]>([]);
```

3. Bæta við `childcareSummary` með useMemo
```typescript
const childcareSummary = useMemo(() => {
  if (!results?.actualHourlyWage) return null;
  return calculateChildcareSummary(childcareItems, results.actualHourlyWage);
}, [childcareItems, results?.actualHourlyWage]);
```

4. Útfæra `addChildcareItem()`
```typescript
const addChildcareItem = useCallback((item: Omit<ChildcareItem, 'id'>) => {
  const newItem: ChildcareItem = {
    ...item,
    id: generateChildcareId(),
  };
  setChildcareItems(prev => [...prev, newItem]);
}, []);
```

5. Útfæra `updateChildcareItem()`
```typescript
const updateChildcareItem = useCallback(
  (id: string, updates: Partial<ChildcareItem>) => {
    setChildcareItems(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
  },
  []
);
```

6. Útfæra `deleteChildcareItem()`
```typescript
const deleteChildcareItem = useCallback((id: string) => {
  setChildcareItems(prev => prev.filter(item => item.id !== id));
}, []);
```

7. Uppfæra localStorage hleðslu til að innihalda childcareItems
```typescript
useEffect(() => {
  const stored = localStorage.getItem('life-energy-calculator');
  if (stored) {
    const data: StoredState = JSON.parse(stored);
    setChildcareItems(data.childcareItems || []);
  }
}, []);
```

8. Uppfæra localStorage vistun
```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    const state: StoredState = {
      // ... existing fields
      childcareItems,
    };
    localStorage.setItem('life-energy-calculator', JSON.stringify(state));
  }, 500);
  return () => clearTimeout(timer);
}, [childcareItems, /* other deps */]);
```

9. Uppfæra `exportData()` til að innihalda childcareItems
10. Uppfæra `importData()` til að flytja inn childcareItems
11. Uppfæra `resetAll()` til að hreinsa childcareItems

**Samþykktarviðmið**:
- [x] Context veitir childcareItems og setters
- [x] Context veitir childcareSummary útreikninga
- [x] CRUD aðgerðir virka rétt
- [x] Niðurstöður uppfærast sjálfkrafa
- [x] localStorage vistun/hleðsla virkar
- [x] exportData inniheldur childcareItems
- [x] importData flytur inn childcareItems
- [x] resetAll núllstillir childcareItems

**Útfærsla**:
- Updated `CalculatorContextType` interface with childcare methods
- Added `childcareItems` state array
- Added `childcareSummary` with useMemo for automatic recalculation
- Implemented `addChildcareItem`, `updateChildcareItem`, `deleteChildcareItem`
- Updated localStorage loading/saving in all relevant places:
  - Initial load effect
  - Auto-save effect (with debounce)
  - saveToStorage callback
  - loadFromStorage callback
  - exportDataHandler
  - importDataHandler
  - resetAll
- Updated `StoredState` type to include `childcareItems?: ChildcareItem[]`
- Context module documentation created: `specs/context/modules/ChildcareCalculatorContext.md`

**Prófun**:
```typescript
test('bætir við umönnunarlið rétt', () => {});
test('uppfærir childcareSummary þegar liðum breytt', () => {});
test('vistar í localStorage með debounce', () => {});
```

---

## Epic 2: UI íhlutir fyrir hvern flokk

**Markmið**: Búa til alla UI íhluti fyrir hvern flokk umönnunar- og menntakostnaðar.

**Áætlaður tími**: 12-16 klst

**Háðir**: Epic 1 (grunngerð)

### Verkefni 2.1: Búa til DaycareSection íhlut

**Staða**: [ ] Ekki byrjað | [ ] Í vinnslu | [ ] Lokið
**Flækjustig**: Miðlungs
**Áætlaður tími**: 3 klst

**Lýsing**: Leikskóli kafli með tegundavali og fjölda barna.

**Skrár til að búa til**:
- `src/components/childcare/DaycareSection.tsx`

**Útfærsla**:

1. Búa til íhlut með props interface
```typescript
interface DaycareSectionProps {
  items: ChildcareItem[];
  onAdd: (item: Omit<ChildcareItem, 'id'>) => void;
  onUpdate: (id: string, item: Partial<ChildcareItem>) => void;
  onDelete: (id: string) => void;
}
```

2. Eyðublað með:
   - Dropdown fyrir tegund (sveitarfélag, einkarekinn, annað)
   - Input fyrir fjöldi barna
   - Input fyrir mánaðarkostnað (forstillt eftir tegund)

3. Sýna útreikning: "30.000 kr × 2 börn = 60.000 kr/mán"

4. Card layout með Tailwind stílum

5. Staðfesting á inntaki

**Samþykktarviðmið**:
- [x] Sýnir forstillt verð fyrir tegund
- [x] Margfaldar með fjölda barna
- [x] Staðfestir ógilt inntak
- [x] Tengist við context CRUD aðgerðir
- [x] Svörun fyrir farsíma
- [x] Aðgengilegur (ARIA labels)

**Prófun**:
```typescript
test('sýnir forstillt verð fyrir sveitarfélag', () => {});
test('margfaldar kostnað með fjölda barna', () => {});
```

---

### Verkefni 2.2: Búa til AfterSchoolSection íhlut

**Staða**: [ ] Ekki byrjað | [ ] Í vinnslu | [ ] Lokið
**Flækjustig**: Miðlungs
**Áætlaður tími**: 2 klst

**Lýsing**: Frístundarkafli með sumarmánuði virkjun.

**Skrár til að búa til**:
- `src/components/childcare/AfterSchoolSection.tsx`

**Útfærsla**:

1. Búa til íhlut með props (svipaður og DaycareSection)

2. Eyðublað með:
   - Input fyrir fjöldi barna
   - Input fyrir mánaðarkostnað á barn (forstillt 25.000 kr)
   - Checkbox fyrir "Sumarmánuðir virkir" (9 vs 12 mánuðir)

3. Sýna útreikning: "25.000 kr × 1 barn × 9 mán = 225.000 kr/ári"

4. Tooltip útskýrir muninn á 9 vs 12 mánuðum

**Samþykktarviðmið**:
- [x] Forstillt verð 25.000 kr
- [x] Checkbox breytir mánuðum (9 ↔ 12)
- [x] Sýnir bæði mánaðar- og árskostnað
- [x] Staðfesting virkar
- [x] Aðgengilegur

**Prófun**:
```typescript
test('breytir mánuðum þegar checkbox valið', () => {});
```

---

### Verkefni 2.3: Búa til ActivitiesSection íhlut

**Staða**: [ ] Ekki byrjað | [ ] Í vinnslu | [ ] Lokið
**Flækjustig**: Miðlungs-Hátt
**Áætlaður tími**: 4 klst

**Lýsing**: Tónlistarskóli og tímar með mörgum börnum og mörgum tímum.

**Skrár til að búa til**:
- `src/components/childcare/ActivitiesSection.tsx`
- `src/components/childcare/ActivityForm.tsx` (modal eyðublað)

**Útfærsla**:

1. Lista yfir alla tíma með breyta/eyða hnöppum

2. "Bæta við tímum" hnappur sem opnar modal

3. Modal eyðublað með:
   - Input fyrir heiti
   - Input fyrir mánaðarkostnað
   - Input fyrir fjöldi mánaða á ári (1-12)
   - Input fyrir fjöldi barna

4. Flýtival dropdown með algengum tímum:
   - Tónlistarskóli (15k, 9mán)
   - Íþróttir (10k, 10mán)
   - Sund (8k, 12mán)
   - Dans (12k, 9mán)

5. Listi sýnir: "Píanótímar - 15.000 kr/mán (9 mán) - 2 börn"

**Samþykktarviðmið**:
- [x] Listi sýnir alla tíma
- [x] Hægt að bæta við, breyta, eyða
- [x] Flýtival fyller út sjálfkrafa
- [x] Staðfesting á öllum inntökum
- [x] Modal aðgengilegt
- [x] Svörun fyrir farsíma

**Prófun**:
```typescript
test('bætir við tímum með flýtivali', () => {});
test('margfaldar kostnað með fjölda barna', () => {});
```

---

### Verkefni 2.4: Búa til TutoringSection íhlut

**Staða**: [ ] Ekki byrjað | [ ] Í vinnslu | [ ] Lokið
**Flækjustig**: Einfalt
**Áætlaður tími**: 2 klst

**Lýsing**: Einkakennsla með tímafjölda.

**Skrár til að búa til**:
- `src/components/childcare/TutoringSection.tsx`

**Útfærsla**:

1. Eyðublað með:
   - Input fyrir tegund kennslu (t.d. "Stærðfræði")
   - Input fyrir kostnaður á klukkustund (forstillt 8.000 kr)
   - Input fyrir fjöldi klukkustunda á mánuði

2. Sýna útreikning: "8.000 kr × 4 klst = 32.000 kr/mán"

3. Lista yfir alla einkakennslu liði

**Samþykktarviðmið**:
- [x] Forstillt 8.000 kr/klst
- [x] Reiknar mánaðarkostnað rétt
- [x] Staðfesting virkar
- [x] Aðgengilegur

**Prófun**:
```typescript
test('reiknar mánaðarkostnað úr tímafjölda', () => {});
```

---

### Verkefni 2.5: Búa til UniversitySection íhlut

**Staða**: [ ] Ekki byrjað | [ ] Í vinnslu | [ ] Lokið
**Flækjustig**: Hátt
**Áætlaður tími**: 4 klst

**Lýsing**: Háskólasparnaður með framtíðarútreikningum.

**Skrár til að búa til**:
- `src/components/childcare/UniversitySection.tsx`

**Útfærsla**:

1. Eyðublað með:
   - Input fyrir núverandi aldur barns (0-17)
   - Input fyrir háskólaaldur (18-25, sjálfgefið 18)
   - Input fyrir áætlaður háskólakostnaður á ári (forstillt 2.500.000 kr)
   - Input fyrir fjöldi ára í háskóla (1-10, sjálfgefið 3)
   - Dropdown fyrir ávöxtun (3%, 5%, 7%)

2. Sýna niðurstöður:
   - Heildarkostnaður háskóla
   - Mánuðir þar til háskóli byrjar
   - Mánaðarlegur sparnaður þarf

3. Tooltip útskýrir FV formúlu

4. Sýna viðvörun ef barn þegar of gamalt

**Samþykktarviðmið**:
- [x] Reiknar mánaðarlegan sparnað með FV formúlu
- [x] Sýnir heildarkostnað og mánuði þar til
- [x] Staðfestir aldur (currentAge < collegeAge)
- [x] Tooltip útskýrir forsendur
- [x] Aðgengilegur

**Prófun**:
```typescript
test('reiknar mánaðarlegan sparnað rétt', () => {});
test('sýnir villu ef barn þegar í háskólaaldri', () => {});
```

---

### Verkefni 2.6: Búa til CategoryBreakdown íhlut

**Staða**: [ ] Ekki byrjað | [ ] Í vinnslu | [ ] Lokið
**Flækjustig**: Miðlungs
**Áætlaður tími**: 2 klst

**Lýsing**: Sýnir sundurliðun eftir flokkum með myndrænni framsetning.

**Skrár til að búa til**:
- `src/components/childcare/CategoryBreakdown.tsx`

**Útfærsla**:

1. Sækja `childcareSummary.byCategory` úr context

2. Búa til lista með flokkasamantekt:
   - Flokkamerki (íslenskt)
   - Fjöldi liða
   - Samtala (árlega og mánaðarlega)
   - Prósentu hlutdeild

3. Horizontal bar chart eða framvindustika

4. Litakóðun fyrir hvern flokk:
   - Leikskóli: blue-500
   - Frístund: green-500
   - Tímar: purple-500
   - Einkakennsla: orange-500
   - Háskóli: indigo-500

5. Raðað eftir kostnaði (hæstur fyrst)

6. Collapsible á farsíma (accordion)

**Samþykktarviðmið**:
- [x] Sýnir alla flokka með liðum
- [x] Raðað eftir kostnaði
- [x] Sýnir fjölda, samtölu, prósentu
- [x] Litakóðun virkar
- [x] Svörun fyrir farsíma

**Prófun**:
```typescript
test('raðar flokkum eftir kostnaði', () => {});
test('sýnir prósentu rétt', () => {});
```

---

## Epic 3: Aðal reiknivél og samþætting

**Markmið**: Sameina alla íhluti í aðal reiknivél og bæta við síðu.

**Áætlaður tími**: 4-6 klst

**Háðir**: Epic 2 (UI íhlutir)

### Verkefni 3.1: Búa til ChildcareEducationCalculator íhlut

**Staða**: [ ] Ekki byrjað | [ ] Í vinnslu | [ ] Lokið
**Flækjustig**: Miðlungs
**Áætlaður tími**: 3 klst

**Lýsing**: Aðal íhlutur sem sameinar alla undiríhluti.

**Skrár til að búa til**:
- `src/components/childcare/ChildcareEducationCalculator.tsx`
- `src/components/childcare/index.ts` (barrel export)

**Útfærsla**:

1. Sækja gögn úr context:
```typescript
const {
  childcareItems,
  childcareSummary,
  results,
  addChildcareItem,
  updateChildcareItem,
  deleteChildcareItem,
} = useCalculator();
```

2. Heildaryfirlit kort með:
   - Mánaðarkostnaður (meðaltal)
   - Árskostnaður
   - Lífsorku klukkustundir (ef actualHourlyWage til staðar)

3. Layout með grid (2 dálkar á desktop):
   - Vinstri: Allar sections (Leikskóli, Frístund, Tímar, o.s.frv.)
   - Hægri: CategoryBreakdown

4. Hero hluti með skýringartexta

5. Viðvörun ef actualHourlyWage vantar:
   ```
   ⚠️ Til að sjá lífsorku kostnað þarftu að fylla fyrst út
      Raunverulega Tímakaups reiknivélina hér að ofan.
   ```

6. Accordion pattern á farsíma fyrir hverja section

**Samþykktarviðmið**:
- [x] Heildaryfirlit sýnir rétt samtölur
- [x] Allir undiríhlutir virka
- [x] Layout svarar fyrir desktop og farsíma
- [x] Viðvörun sýnist ef actualHourlyWage vantar
- [x] Aðgengilegur

**Prófun**:
```typescript
test('sýnir viðvörun ef actualHourlyWage vantar', () => {});
test('uppfærir heildaryfirlit þegar liðum breytt', () => {});
```

---

### Verkefni 3.2: Bæta við reiknivélar síðu/flipa

**Staða**: [ ] Ekki byrjað | [ ] Í vinnslu | [ ] Lokið
**Flækjustig**: Einfalt
**Áætlaður tími**: 2 klst

**Lýsing**: Bæta við nýjum flipa eða síðu fyrir umönnunarreiknivél.

**Skrár til að breyta**:
- `src/app/page.tsx` (ef tabs) eða
- `src/app/childcare/page.tsx` (ef ný route)
- `src/components/Navigation.tsx` (ef til)

**Útfærsla**:

1. Bæta við flipa/route fyrir "Umönnun og menntun"

2. Flytja inn ChildcareEducationCalculator

3. Pakka inn í CalculatorProvider (ef þarf)

4. Bæta við metadata (title, description)

5. Prófa navigation milli flipa

**Samþykktarviðmið**:
- [x] Flipi/route virkar
- [x] ChildcareEducationCalculator birtist
- [x] Gögn deilast með aðalreiknivél
- [x] Metadata uppfærð
- [x] Back/forward vafra virkar

**Prófun**:
```typescript
test('navigerar á umönnunarsíðu', () => {});
test('deilir gögnum með aðalreiknivél', () => {});
```

---

## Epic 4: Staðfesting og villumeðhöndlun

**Markmið**: Bæta við staðfestingu, villumeðhöndlun og notendaboðum.

**Áætlaður tími**: 4-6 klst

**Háðir**: Epic 2 (UI íhlutir)

### Verkefni 4.1: Útfæra staðfestingarföll

**Staða**: [ ] Ekki byrjað | [ ] Í vinnslu | [ ] Lokið
**Flækjustig**: Miðlungs
**Áætlaður tími**: 3 klst

**Lýsing**: Skrifa staðfestingarföll fyrir öll inntök.

**Skrár til að búa til**:
- `src/lib/utils/validators.ts` (uppfæra)

**Útfærsla**:

1. Útfæra `validateChildcareItem()`
   - Staðfesta nafn (ekki tómt, < 100 stafir)
   - Staðfesta kostnaður (>= 0, ekki óraunhæfur)
   - Staðfesta mánuðir (1-12)
   - Staðfesta fjöldi barna (>= 1, ekki óraunhæfur)
   - Staðfesta aldur fyrir háskóla (currentAge < collegeAge)

2. Búa til `CHILDCARE_ERROR_MESSAGES` með íslensku skilaboðum

3. Nota í öllum eyðublöðum

**Samþykktarviðmið**:
- [x] Staðfesting hafnar ógildri gögnum
- [x] Skilaboð á íslensku
- [x] Sértæk villuboð fyrir hvern reit
- [x] Sanngirnispróf fyrir óraunhæf gildi

**Prófun**:
```typescript
test('hafnar tómu nafni', () => {});
test('hafnar neikvæðum kostnaði', () => {});
test('hafnar óraunhæfum aldri', () => {});
```

---

### Verkefni 4.2: Bæta við villumeðhöndlun í íhlutum

**Staða**: [ ] Ekki byrjað | [ ] Í vinnslu | [ ] Lokið
**Flækjustig**: Miðlungs
**Áætlaður tími**: 3 klst

**Lýsing**: Bæta við villumeðhöndlun og notendaboðum í alla íhluti.

**Skrár til að breyta**:
- Allir section íhlutir (Daycare, AfterSchool, o.s.frv.)

**Útfærsla**:

1. Bæta við villustöðu (error state) í hvert eyðublað

2. Sýna villuboð við viðkomandi reit

3. Merkja villureitir með rauðum ramma

4. Hindra vistun þar til villur lagaðar

5. Staðfestingardialog fyrir eyðingu:
   ```
   Eyða lið?
   Ertu viss um að þú viljir eyða "[nafn]"?
   [Hætta við]  [Eyða]
   ```

6. Toast tilkynningar fyrir aðgerðir:
   - "Lið hefur verið vistaður"
   - "Lið hefur verið eytt"

**Samþykktarviðmið**:
- [x] Villur sýnast við reitir
- [x] Staðfestingardialog fyrir eyðingu
- [x] Toast tilkynningar virka
- [x] Aðgengilegt (ARIA live regions)

**Prófun**:
```typescript
test('sýnir villu fyrir ógilt inntak', () => {});
test('biður um staðfestingu áður en eytt', () => {});
```

---

## Epic 5: Prófanir

**Markmið**: Skrifa ítarlegar prófanir fyrir alla virkni.

**Áætlaður tími**: 8-10 klst

**Háðir**: Epic 1-4 (öll útfærsla)

### Verkefni 5.1: Skrifa einingarprófanir fyrir útreikninga

**Staða**: [ ] Ekki byrjað | [ ] Í vinnslu | [ ] Lokið
**Flækjustig**: Miðlungs
**Áætlaður tími**: 4 klst

**Lýsing**: Skrifa ítarlegar prófanir fyrir útreikningavél.

**Skrár til að búa til**:
- `tests/lib/calculations/childcare.test.ts`

**Útfærsla**:

1. Prófanir fyrir `calculateChildcareSummary()`:
   - Engir liðir (skilar 0)
   - Einn liður
   - Margir liðir
   - Margir flokkar
   - Mörg börn
   - Mismunandi fjöldi mánaða

2. Prófanir fyrir `calculateUniversitySavings()`:
   - Venjuleg gildi
   - Barn þegar í háskóla (skilar 0)
   - Mismunandi ávöxtunarprósentur
   - Jaðartilvik (0% ávöxtun)

3. Prófanir fyrir `generateChildcareId()`:
   - Einkvæmni

4. Keyra þekjuskýrslu: > 90% fyrir childcare.ts

**Samþykktarviðmið**:
- [x] Allar prófanir standast
- [x] > 90% þekja á childcare.ts
- [x] Jaðartilvik prófuð

**Prófun**:
```bash
npm test -- childcare.test.ts
npm run test:coverage
```

---

### Verkefni 5.2: Skrifa samþættingarprófanir fyrir Context

**Staða**: [ ] Ekki byrjað | [ ] Í vinnslu | [ ] Lokið
**Flækjustig**: Miðlungs
**Áætlaður tími**: 3 klst

**Lýsing**: Prófa Context samþættingu.

**Skrár til að búa til**:
- `tests/context/CalculatorContext-childcare.test.tsx`

**Útfærsla**:

1. Prófa CRUD aðgerðir:
   - addChildcareItem()
   - updateChildcareItem()
   - deleteChildcareItem()

2. Prófa childcareSummary uppfærslu

3. Prófa localStorage vistun/hleðslu

4. Prófa export/import með childcareItems

**Samþykktarviðmið**:
- [x] Allar CRUD aðgerðir virka
- [x] childcareSummary uppfærist rétt
- [x] localStorage virkar
- [x] Export/import virkar

**Prófun**:
```typescript
test('bætir við umönnunarlið', () => {});
test('uppfærir childcareSummary þegar liðum breytt', () => {});
test('vistar í localStorage', () => {});
```

---

### Verkefni 5.3: Skrifa íhlutaprófanir

**Staða**: [ ] Ekki byrjað | [ ] Í vinnslu | [ ] Lokið
**Flækjustig**: Miðlungs
**Áætlaður tími**: 4 klst

**Lýsing**: Prófa React íhluti.

**Skrár til að búa til**:
- `tests/components/childcare/DaycareSection.test.tsx`
- `tests/components/childcare/AfterSchoolSection.test.tsx`
- `tests/components/childcare/ActivitiesSection.test.tsx`
- `tests/components/childcare/TutoringSection.test.tsx`
- `tests/components/childcare/UniversitySection.test.tsx`
- `tests/components/childcare/CategoryBreakdown.test.tsx`
- `tests/components/childcare/ChildcareEducationCalculator.test.tsx`

**Útfærsla**:

1. Render prófanir fyrir hvern íhlut

2. Gagnvirknispróf (bæta við, breyta, eyða)

3. Staðfestingarprófun

4. Aðgengispróf (ARIA, keyboard navigation)

**Samþykktarviðmið**:
- [x] Allir lykilíhlutir með prófanir
- [x] Gagnvirkni prófuð
- [x] Staðfesting prófuð
- [x] Aðgengi prófað

**Prófun**:
```bash
npm test -- childcare/
```

---

### Verkefni 5.4: Skrifa E2E prófanir

**Staða**: [ ] Ekki byrjað | [ ] Í vinnslu | [ ] Lokið
**Flækjustig**: Miðlungs
**Áætlaður tími**: 3 klst

**Lýsing**: End-to-end prófanir á fullu notendaflæði.

**Skrár til að búa til**:
- `tests/e2e/childcare-flow.spec.ts` (Playwright)

**Útfærsla**:

1. Flæði: Fylla út tímakaup → bæta við leikskóla → sjá lífsorku

2. Flæði: Bæta við mörgum liðum → sjá sundurliðun

3. Flæði: Reikna háskólasparnað → sjá mánaðarlega upphæð

4. Flæði: Breyta lið → eyða lið

5. Flæði: Export gögn → import gögn

**Samþykktarviðmið**:
- [x] Öll helstu flæði prófuð
- [x] Prófanir keyra á local og CI
- [x] < 3 mín framkvæmdatími

**Prófun**:
```bash
npm run test:e2e
```

---

## Epic 6: Fággun og skjalagerð

**Markmið**: Fággun á UX, aðgengi, og skjalagerð.

**Áætlaður tími**: 4-6 klst

**Háðir**: Epic 1-5 (öll útfærsla og prófanir)

### Verkefni 6.1: Aðgengis-audit og lagfæringar

**Staða**: [ ] Ekki byrjað | [ ] Í vinnslu | [ ] Lokið
**Flækjustig**: Miðlungs
**Áætlaður tími**: 3 klst

**Lýsing**: Keyra aðgengispróf og laga allar fundnar villur.

**Tól**:
- axe DevTools
- Lighthouse
- Skjálesari (VoiceOver/NVDA)

**Útfærsla**:

1. Keyra axe DevTools á öllum síðum

2. Laga allar Critical og Serious villur

3. Prófa með skjálesara:
   - Allir form fields hafa labels
   - Live regions fyrir dynamic uppfærslur
   - Focus indicators sýnilegir
   - Tab order rökrétt

4. Keyra Lighthouse og ná > 90 í Accessibility

**Samþykktarviðmið**:
- [x] Engar Critical/Serious axe villur
- [x] Lighthouse Accessibility > 90
- [x] Skjálesari virkar rétt
- [x] Keyboard navigation virkar

**Prófun**:
- Handvirk próf með skjálesara
- axe DevTools
- Lighthouse

---

### Verkefni 6.2: UX fággun

**Staða**: [ ] Ekki byrjað | [ ] Í vinnslu | [ ] Lokið
**Flækjustig**: Einfalt
**Áætlaður tími**: 2 klst

**Lýsing**: Fínpússa notendaupplifun.

**Útfærsla**:

1. Bæta við loading states þar sem við á

2. Bæta við hjálpartexta (tooltips) með dæmum

3. Tryggja samræmi í stílum

4. Bæta við transitions fyrir smooth UX

5. Prófa á raunverulegum gögnum

**Samþykktarviðmið**:
- [x] Loading states þar sem við á
- [x] Hjálpartextar skýrir
- [x] Samræmi í stílum
- [x] Smooth transitions

---

### Verkefni 6.3: Uppfæra barrel exports

**Staða**: [ ] Ekki byrjað | [ ] Í vinnslu | [ ] Lokið
**Flækjustig**: Einfalt
**Áætlaður tími**: 0.5 klst

**Lýsing**: Uppfæra allar barrel export skrár.

**Skrár til að búa til/breyta**:
- `src/components/childcare/index.ts`
- `src/lib/calculations/index.ts`

**Útfærsla**:

1. Uppfæra `src/components/childcare/index.ts`:
```typescript
export { ChildcareEducationCalculator } from './ChildcareEducationCalculator';
export { DaycareSection } from './DaycareSection';
export { AfterSchoolSection } from './AfterSchoolSection';
export { ActivitiesSection } from './ActivitiesSection';
export { TutoringSection } from './TutoringSection';
export { UniversitySection } from './UniversitySection';
export { CategoryBreakdown } from './CategoryBreakdown';
```

2. Uppfæra `src/lib/calculations/index.ts`:
```typescript
export * from './childcare';
```

**Samþykktarviðmið**:
- [x] Öll childcare íhlutir útflutt
- [x] Öll útreikningsföll útflutt
- [x] Engar TypeScript villur

---

## Samantekt

| Epic | Lýsing | Verkefni | Áætlaður tími |
|------|--------|----------|---------------|
| 1 | Grunngerð og gagnalög | 3 | 8-10 klst |
| 2 | UI íhlutir fyrir hvern flokk | 6 | 12-16 klst |
| 3 | Aðal reiknivél og samþætting | 2 | 4-6 klst |
| 4 | Staðfesting og villumeðhöndlun | 2 | 4-6 klst |
| 5 | Prófanir | 4 | 8-10 klst |
| 6 | Fággun og skjalagerð | 3 | 4-6 klst |

**Heildarverkefni**: 20
**Heildar áætlun**: 40-54 klst

**Krítísk leið**: Epic 1 → Epic 2 → Epic 3 → Epic 4/5/6 (samhliða)

---

## Athugasemdir

### Forgangsröðun

**Must-have fyrir MVP**:
- Epic 1 (grunngerð)
- Epic 2 (UI íhlutir)
- Epic 3 (aðal reiknivél)
- Verkefni 4.1 (staðfesting)

**Should-have**:
- Verkefni 4.2 (villumeðhöndlun)
- Epic 5 (prófanir)

**Nice-to-have**:
- Epic 6 (fággun)
- ScenarioComparison íhlutur (framtíðarútvíkkun)

### Samþætting við núverandi kóða

- Notar núverandi CalculatorContext
- Deilir actualHourlyWage með aðalreiknivél
- Notar sömu UI íhluti (Card, Input, Button, Select)
- Notar sama localStorage kerfi
- Vistar með export/import virkni

### Næstu skref

1. **Byrja á Epic 1** (grunngerð):
   - Verkefni 1.1: TypeScript týpur
   - Verkefni 1.2: Útreikningavél
   - Verkefni 1.3: Context uppfærsla

2. **Halda áfram með Epic 2** (UI íhlutir):
   - Byrja á DaycareSection (einfaldast)
   - Halda áfram í AfterSchool, Tutoring
   - ActivitiesSection og UniversitySection síðast (flóknast)

3. **Samþætta í Epic 3**:
   - Aðal reiknivél
   - Bæta við síðu/flipa

4. **Bæta við gæðatrygingu**:
   - Staðfesting (Epic 4)
   - Prófanir (Epic 5)
   - Fággun (Epic 6)

### Áhættustjórnun

**Helstu áhættur**:

1. **FV formúla flækjustig**:
   - Mildun: Prófa með þekktum gildum, bera saman við önnur tól

2. **Margra barna stuðningur flækir UI**:
   - Mildun: Halda UI einföldu, nota clear labels

3. **Aðgengismál með flóknum eyðublöðum**:
   - Mildun: Prófa með skjálesara reglulega, fylgja best practices

4. **localStorage þrengsli með mörgum liðum**:
   - Mildun: Fylgjast með stærð, bæta við compression ef þörf

### Tækifæri til útvíkkunar

**Framtíðareiginleikar**:
- Sviðsmyndasamanburður (ScenarioComparison)
- Graf sem sýnir kostnað eftir aldri barns
- Tilkynningar um komandi breytingar
- Samþætting við opinber gögn um leikskólaverð
- PDF útflutningur á áætlun

**Þessi verkefni eru utan gildissviðs MVP en gætu bæst við í framtíðinni.**
