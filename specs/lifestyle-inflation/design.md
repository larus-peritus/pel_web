# Hönnunarskjal: Lífsstílsverðbólguskynjarinn

## Yfirlit

**Eiginleiki**: Lífsstílsverðbólguskynjarinn (Lifestyle Inflation Detector)
**Forrit**: peninganaedalifid.is
**Kröfuskjal**: [requirements.md](./requirements.md)

### Samantekt

Lífsstílsverðbólguskynjarinn hjálpar notendum að greina og fylgjast með lífsstílsverðbólgu (lifestyle creep) með því að bera saman útgjöld yfir mörg tímabil. Eiginleikinn sýnir ekki bara hvar útgjöld hafa aukist, heldur einnig raunveruleg áhrif á fjárhagslegt frelsi í lífsorku og fjárhagslegum skilmálum.

**Lykilvirkni**:
- Skrá útgjöld eftir flokkum fyrir mörg tímabil (mánuði/ár)
- Greina útgjaldabreytingar og bera saman við tekjubreytingar
- Sýna "lífsstílsskrið" prósenta (hversu mikið útgjöld vaxa umfram tekjur)
- Reikna FI áhrif lífsstílsverðbólgu (seinkun í árum)
- Viðvaranir þegar útgjöld vaxa hraðar en tekjur
- Myndrænar framsetningar (línurit, súlurit, þróunargraf)
- Tillögur að því að viðhalda lífsstíl án aukinnar eyðslu

### Kjarnaforsendur

1. **Client-only arkitektúr**: Engar netbeiðnir, öll gögn í localStorage
2. **Tímabilatengd greining**: Notendur skrá "snaps" af útgjöldum á ákveðnum tímapunktum
3. **Flokkaskipting**: 9 flokkar sem ná yfir flestar algengar útgjaldategundir
4. **Samanburðarathugun**: Alltaf bera saman við fyrra tímabil og sýna þróun
5. **FI-miðaðir útreikningar**: Allt sýnt í samhengi við fjárhagslegt frelsi
6. **Aðgerðamiðaðar viðvaranir**: Ekki bara greining, heldur tillögur að úrbótum

### Lykilíhlutir

- **LifestyleInflationDetector**: Aðal dashboard með yfirliti
- **PeriodManager**: Stjórnun á tímabilum (skrá, breyta, eyða)
- **ExpenseTracker**: Skráning útgjalda eftir flokkum
- **ComparisonView**: Hlið við hlið samanburður tímabila
- **TrendChart**: Línurit sem sýnir þróun yfir tíma
- **CategoryBreakdown**: Sundurliðun eftir flokkum með breytingum
- **InflationAlerts**: Viðvaranir og tillögur
- **FIImpactCalculator**: FI seinkun og framtíðarvirði útreikningar

### Tæknistafl

- **React** + **TypeScript**: Fyrir UI íhluti með tegundaöryggi
- **Context API**: Sameiginleg stöðustjórnun með CalculatorContext
- **localStorage**: Vistun gagna (engin backend)
- **Tailwind CSS**: Samræmd stílsetning
- **Recharts / Chart.js**: Fyrir línurit og súlurit
- **useMemo**: Rauntíma útreikningar án endurútreiknings

### Lykilútreikningar

```typescript
// Lífsstílsverðbólguprósentur
lifestyleCreep% = ((newExpenses - oldExpenses) / oldExpenses) × 100 - incomeChange%

// FI seinkun
increasedAnnualExpenses = (newMonthly - oldMonthly) × 12
increasedFITarget = increasedAnnualExpenses × 25  // 4% rule
fiDelayYears = increasedFITarget / annualSavings

// Framtíðarvirði tapað
lostFutureValue = increasedMonthly × ((1 + r)^n - 1) / r
  // þar sem r = 0.07/12, n = 120 (10 ár)

// Launahækkunar nýtni
utilization% = (expenseIncrease / incomeIncrease) × 100
```

### Hönnunarákvarðanir

Sex meginákvarðanir mótuðu hönnunina:

1. **Tímabilstengd hönnun** (ekki dagleg skráning)
   - Notendur skrá "snapshot" af útgjöldum á tilteknum tímapunktum
   - Einfaldar gagnaskráningu og greiningu
   - Minna vesen en dagleg fylgni

2. **9 flokkar útgjalda** (jafnvægi milli smáatriða og einfaldleika)
   - Nægilega nákvæmt til að greina mynstur
   - Ekki of margt til að valda "analysis paralysis"

3. **Samanburðarmiðuð greining** (ekki bara skráning)
   - Hver skráning borin saman við fyrri tímabil
   - Sjálfvirkar viðvaranir þegar þröskuldur nádist

4. **Litakóðað verðbólguskor** (fljótleg sjón)
   - Grænt/gult/appelsínugult/rautt kerfi
   - Áhrif á FI sýnd strax

5. **Tímabilsskilgreining sveigjanleg** (mánuður eða ár)
   - Notendur geta valið mánaðarleg eða árleg tímabil
   - Sjálfvirk aggregation/normalization

6. **Samþætting við CalculatorContext** (ekki aðskilinn Context)
   - Notar actualHourlyWage fyrir lífsorku útreikninga
   - Deilir localStorage og export/import virkni

### Staða útfærslu

**Verður útfært**:
- TypeScript tegundir fyrir Period, SpendingData, InflationAnalysis
- Útreikningsföll fyrir lífsstílsverðbólgu greining
- Context uppfærsla með tímabilum og útgjöldum
- 8+ UI íhlutir
- Myndrænar framsetningar (gröf)
- Viðvörunarkerfi með tillögum
- Prófanir (unit, integration, E2E)

## Arkitektúr

### Yfirlit kerfis

Lífsstílsverðbólguskynjarinn er samþættur eiginleiki sem byggir á núverandi CalculatorContext. Hann bætir við tímabilatengdri gagnaskráningu og greiningarvirkni.

```
┌─────────────────────────────────────────────────────────────────┐
│                         Vafri (Browser)                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                React Forrit (Application)                  │  │
│  │                                                            │  │
│  │  ┌──────────────────────────────────────────────────────┐ │  │
│  │  │           CalculatorContext (Sameiginlegt)           │ │  │
│  │  │  - actualHourlyWage (úr aðalreiknivél)               │ │  │
│  │  │  - periods: Period[] (tímabil með útgjöldum)         │ │  │
│  │  │  - inflationAnalysis (greininganiðurstöður)          │ │  │
│  │  │  - localStorage stjórnun                             │ │  │
│  │  └────────────────┬─────────────────────────────────────┘ │  │
│  │                   │                                        │  │
│  │  ┌────────────────┼────────────────────────────────────┐  │  │
│  │  │                │                                     │  │  │
│  │  │  ┌─────────────▼──────────┐  ┌──────────────────┐   │  │  │
│  │  │  │ Aðalreiknivél          │  │ Verðbólguskynir  │   │  │  │
│  │  │  │ (Wage Calculator)      │  │                  │   │  │  │
│  │  │  │                        │  │ - Tímabila-      │   │  │  │
│  │  │  │ - actualHourlyWage ────┼─▶│   stjórnun       │   │  │  │
│  │  │  │                        │  │ - Útgjaldaskráni │   │  │  │
│  │  │  │                        │  │ - Greining       │   │  │  │
│  │  │  │                        │  │ - Viðvaranir     │   │  │  │
│  │  │  └────────────────────────┘  │ - Gröf           │   │  │  │
│  │  │                               └──────────────────┘   │  │  │
│  │  │                                                       │  │  │
│  │  │  ┌────────────────────────────────────────────────┐  │  │  │
│  │  │  │         Útreikningavél (Calculations)          │  │  │  │
│  │  │  │  - lifestyleInflation.ts (nýtt)                │  │  │  │
│  │  │  │    * analyzeInflation()                        │  │  │  │
│  │  │  │    * calculateFIImpact()                       │  │  │  │
│  │  │  │    * detectQuietUpgrades()                     │  │  │  │
│  │  │  │    * generateAlerts()                          │  │  │  │
│  │  │  │  - lifeEnergy.ts (endurnýtt)                   │  │  │  │
│  │  │  └────────────────────────────────────────────────┘  │  │  │
│  │  │                                                       │  │  │
│  │  │  ┌────────────────────────────────────────────────┐  │  │  │
│  │  │  │      Gagnalög (Data Layer)                     │  │  │  │
│  │  │  │  - localStorage með Period[]                   │  │  │  │
│  │  │  │  - JSON export/import (með tímabilum)          │  │  │  │
│  │  │  └────────────────────────────────────────────────┘  │  │  │
│  │  └───────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Gagnaflæði

1. **Notandi skráir nýtt tímabil** → Period bætt við `periods[]` array
2. **Notandi skráir útgjöld** fyrir tímabilið → SpendingData uppfært
3. **Sjálfvirk greining keyrir** (useMemo):
   - Bera saman við fyrra tímabil
   - Reikna lífsstílsverðbólgu prósentu
   - Greina "þöglar uppfærslur"
   - Reikna FI áhrif
   - Búa til viðvaranir ef viðeigandi
4. **Niðurstöður birtast** í LifestyleInflationDetector dashboard
5. **Gögn vistuð** sjálfkrafa í localStorage (debounced 500ms)

### Samþættingarpunktar

**Með Raunverulegu Tímakaups reiknivélinni**:
- Deilir sama `CalculatorContext`
- Notar `results.actualHourlyWage` fyrir lífsorgu útreikninga
- Ef `actualHourlyWage` er 0 → sýna en án lífsorku gilda

**Með localStorage**:
- Bætt við `periods: Period[]` í `StoredState`
- Flyst með export/import virkni
- Sama útgáfustjórnun (version number)

### Möppubygging

```
apps/peninganaedalifid/
├── src/
│   ├── app/
│   │   └── lifestyle-inflation/
│   │       └── page.tsx                # Lifestyle Inflation síða
│   │
│   ├── components/
│   │   ├── calculator/                 # Núverandi íhlutir
│   │   │   └── ...
│   │   │
│   │   └── lifestyle-inflation/        # NÝTT: Verðbólguskynir íhlutir
│   │       ├── LifestyleInflationDetector.tsx    # Aðal dashboard
│   │       ├── PeriodManager.tsx                 # Tímabilastjórnun
│   │       ├── PeriodForm.tsx                    # Skrá tímabil
│   │       ├── ExpenseTracker.tsx                # Skrá útgjöld
│   │       ├── CategoryInput.tsx                 # Inntak fyrir einn flokk
│   │       ├── ComparisonView.tsx                # Hlið við hlið samanburður
│   │       ├── TrendChart.tsx                    # Línurit þróunar
│   │       ├── CategoryBreakdownChart.tsx        # Súlurit flokka
│   │       ├── InflationScoreDisplay.tsx         # Verðbólguskor
│   │       ├── InflationAlerts.tsx               # Viðvaranir og tillögur
│   │       ├── FIImpactCard.tsx                  # FI áhrif kort
│   │       └── SalaryUtilizationCard.tsx         # Launahækkunar nýting
│   │
│   ├── lib/
│   │   ├── calculations/
│   │   │   ├── lifestyleInflation.ts   # NÝTT: Verðbólgugreiningar
│   │   │   ├── lifeEnergy.ts           # Endurnýtt
│   │   │   └── ...
│   │   │
│   │   ├── constants/
│   │   │   └── spendingCategories.ts   # NÝTT: Flokkaskilgreiningar
│   │   │
│   │   └── utils/
│   │       └── formatters.ts            # Bæta við dagsetningu formöttun
│   │
│   ├── context/
│   │   └── CalculatorContext.tsx        # UPPFÆRT með tímabilum
│   │
│   └── types/
│       └── calculator.ts                # UPPFÆRT með Period, SpendingData, o.s.frv.
│
└── ...
```

## Gagnalíkön

### Kjarnabreytingar

Allar tegundir bættar við `src/types/calculator.ts`.

#### Period

```typescript
/**
 * Eitt tímabil (mánuður eða ár) með útgjöldum
 */
export interface Period {
  id: string;                        // Einstakt auðkenni
  name: string;                      // T.d. "Janúar 2024", "Árið 2023"
  month?: number;                    // 1-12, null ef árleg
  year: number;                      // 2020-2030
  startDate: string;                 // ISO date
  endDate: string;                   // ISO date
  income: number;                    // Tekjur fyrir tímabilið (ISK)
  spending: SpendingData;            // Útgjöld eftir flokkum
  createdAt: string;                 // ISO timestamp
  updatedAt: string;                 // ISO timestamp
}
```

**Staðfestingarreglur**:
- `name`: Ekki tómt, hámark 100 stafir
- `month`: 1-12 eða null
- `year`: 2020-2030
- `income`: >= 0
- `spending`: Allir flokkar verða að vera >= 0

---

#### SpendingData

```typescript
/**
 * Útgjöld flokkuð
 */
export interface SpendingData {
  housing: number;           // Húsnæði (leiga, veð, rafmagn, hiti)
  food: number;              // Matur (matvörur, veitingastaðir)
  transportation: number;    // Samgöngur (bensín, strætó, viðhald)
  subscriptions: number;     // Áskriftir (streymi, hugbúnaður, líkamsrækt)
  convenience: number;       // Þægindi (matur heim, skyndikaupur)
  clothing: number;          // Fatnaður
  entertainment: number;     // Skemmtun (kvikmyndir, tónleikar)
  health: number;            // Heilsa (lyfseðlar, sjúkraþjálfun)
  other: number;             // Annað
}
```

**Sjálfgefin gildi**: Öll gildi = 0

**Hjálparfallur**:
```typescript
export function getTotalSpending(spending: SpendingData): number {
  return Object.values(spending).reduce((sum, val) => sum + val, 0);
}

export function getEmptySpending(): SpendingData {
  return {
    housing: 0,
    food: 0,
    transportation: 0,
    subscriptions: 0,
    convenience: 0,
    clothing: 0,
    entertainment: 0,
    health: 0,
    other: 0,
  };
}
```

---

#### SpendingCategory

```typescript
/**
 * Útgjaldaflokkur lykill
 */
export type SpendingCategory =
  | 'housing'
  | 'food'
  | 'transportation'
  | 'subscriptions'
  | 'convenience'
  | 'clothing'
  | 'entertainment'
  | 'health'
  | 'other';
```

**Íslensku merki** (í `constants/spendingCategories.ts`):
```typescript
export const SPENDING_CATEGORY_LABELS: Record<SpendingCategory, string> = {
  housing: 'Húsnæði',
  food: 'Matur',
  transportation: 'Samgöngur',
  subscriptions: 'Áskriftir',
  convenience: 'Þægindi',
  clothing: 'Fatnaður',
  entertainment: 'Skemmtun',
  health: 'Heilsa',
  other: 'Annað',
};

export const SPENDING_CATEGORY_DESCRIPTIONS: Record<SpendingCategory, string> = {
  housing: 'Leiga/veð, rafmagn, hiti, internet',
  food: 'Matvörur, veitingastaðir, kaffihús',
  transportation: 'Bensín, strætó, bílaviðhald, bílastæði',
  subscriptions: 'Netflix, Spotify, líkamsrækt',
  convenience: 'Matur heim, taxi, skyndikaupur',
  clothing: 'Föt, skór, fylgihlutir',
  entertainment: 'Kvikmyndir, tónleikar, tölvuleikir',
  health: 'Lyfseðlar, sjúkraþjálfun, tannlæknir',
  other: 'Gjafir, heimilisbúnaður, dýrahald',
};
```

---

#### InflationAnalysis

```typescript
/**
 * Greiningarniðurstöður fyrir eitt tímabil borið saman við annað
 */
export interface InflationAnalysis {
  currentPeriod: Period;
  comparisonPeriod: Period | null;  // null ef ekkert fyrra tímabil

  // Heildar útgjöld
  totalSpendingChange: number;      // Króna breyting
  totalSpendingChangePercent: number; // Prósenta breyting

  // Tekjusamanburður
  incomeChange: number;              // Króna breyting
  incomeChangePercent: number;       // Prósenta breyting

  // Lífsstílsverðbólga
  lifestyleCreep: number;            // % útgjaldaaukningar umfram tekjuaukningu
  inflationScore: InflationScore;    // 'healthy' | 'caution' | 'warning' | 'critical'

  // Flokkasundurliðun
  categoryChanges: CategoryChange[];
  quietUpgrades: CategoryChange[];   // Flokkar með smáhækkunum sem bætast upp

  // FI áhrif
  fiImpact: FIImpact;

  // Launahækkunar nýtni
  salaryUtilization?: SalaryUtilization; // null ef engin tekjubreyting

  // Viðvaranir
  alerts: InflationAlert[];
}
```

---

#### CategoryChange

```typescript
/**
 * Breyting í einum flokki
 */
export interface CategoryChange {
  category: SpendingCategory;
  label: string;                     // Íslenskt heiti
  oldAmount: number;
  newAmount: number;
  change: number;                    // Króna breyting
  changePercent: number;             // Prósenta breyting
  lifeEnergyHours: number;           // Lífsorgu kostnaður breytingar (klst)
  severity: 'decrease' | 'stable' | 'minor' | 'moderate' | 'major';
}
```

**Alvarleikaskilgreining**:
- `decrease`: < 0%
- `stable`: 0-5%
- `minor`: 5-15%
- `moderate`: 15-30%
- `major`: 30%+

---

#### FIImpact

```typescript
/**
 * Áhrif lífsstílsverðbólgu á fjárhagslegt frelsi
 */
export interface FIImpact {
  increasedAnnualExpenses: number;   // Aukin árleg útgjöld
  increasedFITarget: number;         // Aukin FI þörf (× 25)
  fiDelayYears: number;              // Seinkun í árum
  fiDelayMonths: number;             // Seinkun í mánuðum (heildarfjöldi)
  lostFutureValue10Years: number;    // Tapað framtíðarvirði í 10 ár
  lostFutureValue20Years: number;    // Tapað framtíðarvirði í 20 ár
}
```

---

#### SalaryUtilization

```typescript
/**
 * Hvernig launahækkun er nýtt
 */
export interface SalaryUtilization {
  incomeIncrease: number;            // Króna tekjuaukning
  expenseIncrease: number;           // Króna útgjaldaaukning
  savingsIncrease: number;           // Króna sparnaðaraukning
  utilizationPercent: number;        // % af launahækkun í lífsstíl
  status: 'healthy' | 'acceptable' | 'concerning' | 'critical';
}
```

**Stöðuskilgreining**:
- `healthy`: 0-30%
- `acceptable`: 30-50%
- `concerning`: 50-80%
- `critical`: 80%+

---

#### InflationAlert

```typescript
/**
 * Viðvörun um lífsstílsverðbólgu
 */
export interface InflationAlert {
  id: string;
  type: 'info' | 'warning' | 'critical';
  category?: SpendingCategory;       // null ef heildarviðvörun
  message: string;                   // Aðal viðvörunarboð
  detail: string;                    // Ítarlegri útskýring
  fiImpact: string;                  // FI áhrif í læsilegum texta
  suggestions: string[];             // Tillögur að úrbótum
  canDismiss: boolean;               // Hvort hægt er að hafna
  dismissed: boolean;                // Hvort hafnað
}
```

---

#### InflationScore

```typescript
/**
 * Heildarverðbólguskor
 */
export type InflationScore =
  | 'healthy'      // 0-5%: Grænt
  | 'caution'      // 5-15%: Gult
  | 'warning'      // 15-30%: Appelsínugult
  | 'critical';    // 30%+: Rautt
```

---

#### StoredState (Uppfært)

```typescript
/**
 * Fullt app state sem vistað er í localStorage
 */
export interface StoredState {
  version: number;                   // Útgáfunúmer
  currentInputs: CalculatorInputs;   // Aðalreiknivél
  scenarios: Scenario[];             // Vistaðar aðstæður
  subscriptions: Subscription[];     // Áskriftir
  periods: Period[];                 // NÝTT: Tímabil með útgjöldum
  lastUpdated: string;               // ISO dagsetning
}
```

---

### Sjálfgefin gildi

```typescript
// lib/defaults.ts (bæta við)

export const DEFAULT_SPENDING: SpendingData = {
  housing: 0,
  food: 0,
  transportation: 0,
  subscriptions: 0,
  convenience: 0,
  clothing: 0,
  entertainment: 0,
  health: 0,
  other: 0,
};

export function createDefaultPeriod(name: string, year: number, month?: number): Omit<Period, 'id'> {
  const now = new Date();
  return {
    name,
    month,
    year,
    startDate: month
      ? new Date(year, month - 1, 1).toISOString()
      : new Date(year, 0, 1).toISOString(),
    endDate: month
      ? new Date(year, month, 0).toISOString()
      : new Date(year, 11, 31).toISOString(),
    income: 0,
    spending: { ...DEFAULT_SPENDING },
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
}
```

## Íhlutir og viðmót

### Síðuútlit

**Desktop útlit (> 1024px)**:

```
┌─────────────────────────────────────────────────────────────────┐
│  Haus (Header)                                      [Flytja út] │
│  peninganaedalifid.is - Lífsstílsverðbólguskynjarinn            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  YFIRLIT                                                 │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │   │
│  │  │ Síðasta      │  │ Lífsstílsskrið│  │ FI seinkun   │   │   │
│  │  │ breyting     │  │ +8,3%        │  │ 1,4 ár       │   │   │
│  │  │ +12.450 kr   │  │ [GULT]       │  │              │   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [Bæta við tímabili]  [Velja tímabil til að bera saman ▼]     │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ÞRÓUN YFIR TÍMA                                         │   │
│  │  [Línurit: Útgjöld vs Tekjur]                            │   │
│  │                                                           │   │
│  │  Útgjöld ━━━━━                                           │   │
│  │  Tekjur ┅┅┅┅┅                                           │   │
│  │  Ef stöðugt - - - -                                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌──────────────────────┐  ┌──────────────────────────────┐   │
│  │  FLOKKASUNDURLIÐUN   │  │  VIÐVARANIR & TILLÖGUR       │   │
│  │  [Súlurit]           │  │                              │   │
│  │                      │  │  🔴 Þægindaútgjöld hafa      │   │
│  │  Húsnæði    ████████ │  │     aukist um 45%            │   │
│  │  Matur      ████████ │  │     → Skipulagðu máltíðir    │   │
│  │  Samgöngur  ████     │  │                              │   │
│  │  Áskriftir  ████████ │  │  🟡 Veitingastaðir hafa      │   │
│  │  ...                 │  │     aukist um 18%            │   │
│  │                      │  │     → Eldaðu heima 2x í viku │   │
│  │  [Núverandi] [Fyrri] │  │                              │   │
│  └──────────────────────┘  └──────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  FI ÁHRIF                                                │   │
│  │  Aukin árleg útgjöld: 149.400 kr                         │   │
│  │  Aukin FI þörf: 3.735.000 kr                            │   │
│  │  Tapað framtíðarvirði (10 ár): 2.580.000 kr             │   │
│  │  Tapað lífsorga: 79 klukkustundir á ári                 │   │
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
│  Lífsstílsverðbólguskynj │
│                         │
│  ┌─────────────────────┐│
│  │ Síðasta breyting    ││
│  │ +12.450 kr (+8,3%)  ││
│  │ [GULT]              ││
│  └─────────────────────┘│
│  ┌─────────────────────┐│
│  │ FI seinkun: 1,4 ár  ││
│  └─────────────────────┘│
│                         │
│  [Bæta við tímabili]    │
│  [Velja til að bera saman]│
│                         │
│  ┌─────────────────────┐│
│  │ ÞRÓUN              │ │
│  │ [Línurit]          │ │
│  │ (scrollable)       │ │
│  └─────────────────────┘│
│                         │
│  ┌─────────────────────┐│
│  │ VIÐVARANIR         │ │
│  │ 🔴 Þægindi +45%    │ │
│  │ [Sjá tillögur]     │ │
│  └─────────────────────┘│
│                         │
│  [Sýna flokka...]       │
│  [Sýna FI áhrif...]     │
│                         │
├─────────────────────────┤
│  Fótur                  │
└─────────────────────────┘
```

### Lykilíhlutir

#### 1. LifestyleInflationDetector

**Tilgangur**: Aðal dashboard sem sýnir yfirlit, þróun, og viðvaranir.

**Ábyrgð**:
- Sækja tímabil og greiningarniðurstöður úr Context
- Sýna heildaryfirlit (síðasta breyting, verðbólguskor, FI seinkun)
- Stjórna hvaða tímabil eru borin saman
- Render undirhluta (gröf, viðvaranir, FI áhrif)

**Opinbert viðmót**:
```typescript
interface LifestyleInflationDetectorProps {
  className?: string;
}
```

**Notar Context**:
```typescript
const {
  periods,
  inflationAnalysis,
  results, // fyrir actualHourlyWage
} = useCalculator();
```

---

#### 2. PeriodManager

**Tilgangur**: Stjórna listanum af tímabilum (skoða, bæta við, breyta, eyða).

**Ábyrgð**:
- Sýna lista af öllum tímabilum
- Leyfa val á tímabili fyrir breytingu eða eyðingu
- Opna PeriodForm til að bæta við nýju tímabili
- Staðfesta eyðingu

**Opinbert viðmót**:
```typescript
interface PeriodManagerProps {
  periods: Period[];
  onSelectPeriod: (id: string) => void;
  onDeletePeriod: (id: string) => void;
  onAddPeriod: () => void;
}
```

---

#### 3. PeriodForm

**Tilgangur**: Eyðublað til að skrá nýtt tímabil eða breyta núverandi.

**Ábyrgð**:
- Inntak fyrir heiti, mánuð/ár, tekjur
- Staðfesting á inntaki
- Vista í Context
- Opna ExpenseTracker eftir vistun

**Opinbert viðmót**:
```typescript
interface PeriodFormProps {
  mode: 'add' | 'edit';
  period?: Period;
  onSave: (period: Omit<Period, 'id'>) => void;
  onCancel: () => void;
}
```

---

#### 4. ExpenseTracker

**Tilgangur**: Skrá útgjöld fyrir valið tímabil, flokkað.

**Ábyrgð**:
- Sýna alla 9 flokka með inntaksreitum
- Reikna heildarsummu sjálfkrafa
- Validation á öllum inntökum
- Vista í Period.spending

**Opinbert viðmót**:
```typescript
interface ExpenseTrackerProps {
  period: Period;
  onSave: (spending: SpendingData) => void;
  onCancel: () => void;
}
```

---

#### 5. CategoryInput

**Tilgangur**: Einn innsláttur reitur fyrir einn útgjaldaflokk.

**Ábyrgð**:
- Label með flokksheiti og lýsingu
- Krónutölu inntak
- Sýna lífsorgu kostnað (ef actualHourlyWage þekkt)
- Real-time validation

**Opinbert viðmót**:
```typescript
interface CategoryInputProps {
  category: SpendingCategory;
  value: number;
  onChange: (value: number) => void;
  actualHourlyWage?: number;
}
```

---

#### 6. ComparisonView

**Tilgangur**: Hlið við hlið samanburður tveggja tímabila.

**Ábyrgð**:
- Sýna tvö tímabil í dálkum
- Bera saman hvern flokk
- Litakóða breytingar (grænt/gult/rautt)
- Sýna prósentubreytingar

**Opinbert viðmót**:
```typescript
interface ComparisonViewProps {
  currentPeriod: Period;
  comparisonPeriod: Period;
  analysis: InflationAnalysis;
}
```

---

#### 7. TrendChart

**Tilgangur**: Línurit sem sýnir útgjöld, tekjur, og "ef stöðugt" línur yfir tíma.

**Ábyrgð**:
- Render línurit með Recharts/Chart.js
- Þrjár línur: útgjöld (solid), tekjur (dashed), stöðugt (dotted)
- Hover til að sjá nákvæm gildi
- Responsive fyrir farsíma

**Opinbert viðmót**:
```typescript
interface TrendChartProps {
  periods: Period[];
  actualHourlyWage?: number;
}
```

---

#### 8. CategoryBreakdownChart

**Tilgangur**: Súlurit sem sýnir útgjöld eftir flokkum, borið saman milli tímabila.

**Ábyrgð**:
- Hlið við hlið súlur fyrir hvern flokk
- Litakóðað eftir breytingastöðu
- Hover fyrir nákvæm gildi
- Raðað eftir stærð (hæst fyrst)

**Opinbert viðmót**:
```typescript
interface CategoryBreakdownChartProps {
  analysis: InflationAnalysis;
}
```

---

#### 9. InflationScoreDisplay

**Tilgangur**: Sýna heildarverðbólguskor með litakóðun.

**Ábyrgð**:
- Stórt badge með lit og texta
- Útskýring á stöðu
- Fyrirfram framtíðar áhrif

**Opinbert viðmót**:
```typescript
interface InflationScoreDisplayProps {
  score: InflationScore;
  lifestyleCreep: number;
}
```

---

#### 10. InflationAlerts

**Tilgangur**: Sýna viðvaranir og tillögur að úrbótum.

**Ábyrgð**:
- Lista allar virkar viðvaranir
- Flokka eftir alvarleika
- Sýna tillögur fyrir hverja viðvörun
- Leyfa að hafna (dismiss) viðvörunum

**Opinbert viðmót**:
```typescript
interface InflationAlertsProps {
  alerts: InflationAlert[];
  onDismiss: (id: string) => void;
}
```

---

#### 11. FIImpactCard

**Tilgangur**: Sýna FI áhrif lífsstílsverðbólgu.

**Ábyrgð**:
- Aukin árleg útgjöld
- Aukin FI þörf
- FI seinkun í árum/mánuðum
- Tapað framtíðarvirði (10/20 ár)
- Lífsorgu kostnaður

**Opinbert viðmót**:
```typescript
interface FIImpactCardProps {
  fiImpact: FIImpact;
  actualHourlyWage?: number;
}
```

---

#### 12. SalaryUtilizationCard

**Tilgangur**: Sýna hvernig launahækkun er nýtt.

**Ábyrgð**:
- Tekjuaukning vs útgjaldaaukning
- Nýtniprósenta
- Stöðumerking (healthy/acceptable/concerning/critical)
- Tillögur um betri nýtingu

**Opinbert viðmót**:
```typescript
interface SalaryUtilizationCardProps {
  utilization: SalaryUtilization;
}
```

---

## Útreikningavél

### Kjarnaföll

Öll föll í `lib/calculations/lifestyleInflation.ts`.

#### analyzeInflation

```typescript
/**
 * Aðalgreining á lífsstílsverðbólgu
 */
export function analyzeInflation(
  currentPeriod: Period,
  comparisonPeriod: Period | null,
  actualHourlyWage?: number
): InflationAnalysis {
  if (!comparisonPeriod) {
    // Fyrsta tímabilið - engin greining
    return createEmptyAnalysis(currentPeriod);
  }

  const totalSpendingChange = getTotalSpending(currentPeriod.spending) -
                              getTotalSpending(comparisonPeriod.spending);
  const totalSpendingChangePercent =
    (totalSpendingChange / getTotalSpending(comparisonPeriod.spending)) * 100;

  const incomeChange = currentPeriod.income - comparisonPeriod.income;
  const incomeChangePercent =
    comparisonPeriod.income > 0
      ? (incomeChange / comparisonPeriod.income) * 100
      : 0;

  const lifestyleCreep = totalSpendingChangePercent - incomeChangePercent;
  const inflationScore = calculateInflationScore(lifestyleCreep);

  const categoryChanges = analyzeCategoryChanges(
    currentPeriod.spending,
    comparisonPeriod.spending,
    actualHourlyWage
  );

  const quietUpgrades = detectQuietUpgrades(categoryChanges);

  const fiImpact = calculateFIImpact(
    totalSpendingChange,
    currentPeriod.income
  );

  const salaryUtilization = incomeChange > 0
    ? calculateSalaryUtilization(incomeChange, totalSpendingChange)
    : undefined;

  const alerts = generateAlerts(
    lifestyleCreep,
    categoryChanges,
    fiImpact,
    salaryUtilization
  );

  return {
    currentPeriod,
    comparisonPeriod,
    totalSpendingChange,
    totalSpendingChangePercent,
    incomeChange,
    incomeChangePercent,
    lifestyleCreep,
    inflationScore,
    categoryChanges,
    quietUpgrades,
    fiImpact,
    salaryUtilization,
    alerts,
  };
}
```

---

#### calculateInflationScore

```typescript
/**
 * Reikna heildarverðbólguskor
 */
export function calculateInflationScore(lifestyleCreep: number): InflationScore {
  if (lifestyleCreep < 5) return 'healthy';
  if (lifestyleCreep < 15) return 'caution';
  if (lifestyleCreep < 30) return 'warning';
  return 'critical';
}
```

---

#### analyzeCategoryChanges

```typescript
/**
 * Greina breytingar í hverjum flokki
 */
export function analyzeCategoryChanges(
  currentSpending: SpendingData,
  comparisonSpending: SpendingData,
  actualHourlyWage?: number
): CategoryChange[] {
  const categories: SpendingCategory[] = [
    'housing', 'food', 'transportation', 'subscriptions',
    'convenience', 'clothing', 'entertainment', 'health', 'other'
  ];

  return categories.map(category => {
    const oldAmount = comparisonSpending[category];
    const newAmount = currentSpending[category];
    const change = newAmount - oldAmount;
    const changePercent = oldAmount > 0 ? (change / oldAmount) * 100 : 0;

    const lifeEnergyHours = actualHourlyWage && actualHourlyWage > 0
      ? Math.abs(change * 12) / actualHourlyWage  // Árlega
      : 0;

    const severity = calculateChangeSeverity(changePercent);

    return {
      category,
      label: SPENDING_CATEGORY_LABELS[category],
      oldAmount,
      newAmount,
      change,
      changePercent,
      lifeEnergyHours,
      severity,
    };
  });
}

function calculateChangeSeverity(changePercent: number): CategoryChange['severity'] {
  if (changePercent < 0) return 'decrease';
  if (changePercent < 5) return 'stable';
  if (changePercent < 15) return 'minor';
  if (changePercent < 30) return 'moderate';
  return 'major';
}
```

---

#### detectQuietUpgrades

```typescript
/**
 * Greina "þöglar uppfærslur" - litlar hækkanir sem bætast upp
 */
export function detectQuietUpgrades(categoryChanges: CategoryChange[]): CategoryChange[] {
  return categoryChanges.filter(change =>
    change.changePercent > 10 &&
    change.changePercent < 30 &&
    change.change > 5000  // Meira en 5.000 kr/mán aukining
  );
}
```

---

#### calculateFIImpact

```typescript
/**
 * Reikna áhrif á FI
 */
export function calculateFIImpact(
  monthlySpendingChange: number,
  currentIncome: number
): FIImpact {
  const increasedAnnualExpenses = monthlySpendingChange * 12;
  const increasedFITarget = increasedAnnualExpenses * 25;  // 4% rule

  // Áætlað árlegur sparnaður (30% af tekjum)
  const estimatedAnnualSavings = currentIncome * 12 * 0.30;
  const fiDelayYears = estimatedAnnualSavings > 0
    ? increasedFITarget / estimatedAnnualSavings
    : 0;

  const fiDelayMonths = Math.round(fiDelayYears * 12);

  // Framtíðarvirði við 7% ávöxtun
  const monthlyIncrease = Math.abs(monthlySpendingChange);
  const lostFutureValue10Years = calculateFutureValue(monthlyIncrease, 0.07, 10);
  const lostFutureValue20Years = calculateFutureValue(monthlyIncrease, 0.07, 20);

  return {
    increasedAnnualExpenses,
    increasedFITarget,
    fiDelayYears,
    fiDelayMonths,
    lostFutureValue10Years,
    lostFutureValue20Years,
  };
}

// Endurnýtt frá subscriptions.ts
function calculateFutureValue(monthlyPayment: number, annualRate: number, years: number): number {
  const monthlyRate = annualRate / 12;
  const months = years * 12;

  if (monthlyRate === 0) {
    return monthlyPayment * months;
  }

  return monthlyPayment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
}
```

---

#### calculateSalaryUtilization

```typescript
/**
 * Reikna launahækkunar nýtni
 */
export function calculateSalaryUtilization(
  incomeIncrease: number,
  expenseIncrease: number
): SalaryUtilization {
  const savingsIncrease = incomeIncrease - expenseIncrease;
  const utilizationPercent = incomeIncrease > 0
    ? (expenseIncrease / incomeIncrease) * 100
    : 0;

  let status: SalaryUtilization['status'];
  if (utilizationPercent < 30) status = 'healthy';
  else if (utilizationPercent < 50) status = 'acceptable';
  else if (utilizationPercent < 80) status = 'concerning';
  else status = 'critical';

  return {
    incomeIncrease,
    expenseIncrease,
    savingsIncrease,
    utilizationPercent,
    status,
  };
}
```

---

#### generateAlerts

```typescript
/**
 * Búa til viðvaranir byggðar á greiningu
 */
export function generateAlerts(
  lifestyleCreep: number,
  categoryChanges: CategoryChange[],
  fiImpact: FIImpact,
  salaryUtilization?: SalaryUtilization
): InflationAlert[] {
  const alerts: InflationAlert[] = [];

  // Heildarviðvörun
  if (lifestyleCreep > 30) {
    alerts.push({
      id: generateId(),
      type: 'critical',
      message: `Alvarleg lífsstílsverðbólga greind`,
      detail: `Útgjöldin þín hafa aukist um ${lifestyleCreep.toFixed(1)}% umfram tekjuaukningu.`,
      fiImpact: `Þetta seinkar FI um ${fiImpact.fiDelayYears.toFixed(1)} ár.`,
      suggestions: [
        'Farðu yfir öll tímabil og greindu hvar aukningin kemur frá',
        'Íhugaðu að frysta útgjöld í 3-6 mánuði til að endurheimta stýringu',
        'Settu þér fjárhagsáætlun fyrir hvern flokk'
      ],
      canDismiss: false,
      dismissed: false,
    });
  } else if (lifestyleCreep > 15) {
    alerts.push({
      id: generateId(),
      type: 'warning',
      message: `Umtalsverð lífsstílsverðbólga`,
      detail: `Útgjöldin þín hafa aukist um ${lifestyleCreep.toFixed(1)}% umfram tekjuaukningu.`,
      fiImpact: `Þetta kostar þig ${fiImpact.fiDelayMonths} mánuði í FI seinkun.`,
      suggestions: [
        'Greindu flokka með stærstu hækkunum',
        'Íhugaðu að lækka 1-2 flokka aftur í fyrra stig'
      ],
      canDismiss: true,
      dismissed: false,
    });
  }

  // Flokkasértækar viðvaranir
  categoryChanges
    .filter(change => change.severity === 'major')
    .forEach(change => {
      alerts.push({
        id: generateId(),
        type: 'critical',
        category: change.category,
        message: `${change.label} hefur aukist um ${change.changePercent.toFixed(1)}%`,
        detail: `Þetta er aukning um ${formatCurrency(change.change)} á mánuði.`,
        fiImpact: `Kostar þig ${change.lifeEnergyHours.toFixed(1)} klukkustundir af lífsorku á ári.`,
        suggestions: getSuggestionsForCategory(change.category),
        canDismiss: true,
        dismissed: false,
      });
    });

  // Launahækkunar nýtni viðvörun
  if (salaryUtilization && salaryUtilization.status === 'critical') {
    alerts.push({
      id: generateId(),
      type: 'critical',
      message: `${salaryUtilization.utilizationPercent.toFixed(0)}% af launahækkun fór í lífsstíl`,
      detail: `Af ${formatCurrency(salaryUtilization.incomeIncrease)} tekjuaukningu fór aðeins ${formatCurrency(salaryUtilization.savingsIncrease)} í sparnað.`,
      fiImpact: `Þú gætir verið kominn í FI ${fiImpact.fiDelayYears.toFixed(1)} árum fyrr.`,
      suggestions: [
        'Reyndu að halda útgjöldum föstum næstu 3-6 mánuði',
        'Flyttu alla tekjuaukningu beint í sparnað',
        'Settu upp sjálfvirka millifærslu í sparnað'
      ],
      canDismiss: true,
      dismissed: false,
    });
  }

  return alerts;
}

function getSuggestionsForCategory(category: SpendingCategory): string[] {
  const suggestions: Record<SpendingCategory, string[]> = {
    housing: [
      'Íhugaðu ódýrara húsnæði eða herbergisleigju',
      'Leitaðu að lægri vöxtum fyrir veð',
      'Lækkaðu rafmagnsnotkun með LED og betri einangrun'
    ],
    food: [
      'Skipulagðu máltíðir fyrirfram',
      'Eldaðu heima 2 sinnum í viðbót á viku',
      'Kauptu í lausu í stað einstaklingspakkningar'
    ],
    transportation: [
      'Íhugaðu hjólreiðar eða gang hluta leiðar',
      'Notaðu samgöngur í stað bíls þar sem hægt er',
      'Skiptu um bíl í sparneytni eða rafbíl'
    ],
    subscriptions: [
      'Farðu yfir allar áskriftir og segðu upp ónotuðum',
      'Skiptu áskriftum með fjölskyldu/vinum',
      'Skiptu milli streymisþjónustu í stað þess að hafa allar'
    ],
    convenience: [
      'Undirbúðu máltíðir um helgar til að forðast skyndikaupur',
      'Settu þér reglu: bíddu 24 klst áður en þú kaupir',
      'Notaðu lista þegar þú ferð í búð'
    ],
    clothing: [
      'Kauptu aðeins það sem þú þarft',
      'Íhugaðu notað frekar en nýtt',
      'Bíddu eftir útsölum fyrir stór kaup'
    ],
    entertainment: [
      'Leitaðu að ókeypis valkostum (bókasafn, gönguferðir)',
      'Takmarkaðu útgjöld til X kr á mánuði',
      'Finndu ódýra áhugamál'
    ],
    health: [
      'Athugaðu hvort sjúkratrygging þín nái yfir kostnað',
      'Íhugaðu forvarnarmeðferð til að forðast dýrari vandamál',
      'Notaðu almennar vörur í stað vörumerkja'
    ],
    other: [
      'Flokkaklárt þessa útgjöld betur',
      'Greindu hvað fellur undir "annað"',
      'Settu þér mörk fyrir þennan flokk'
    ],
  };

  return suggestions[category] || [];
}

function generateId(): string {
  return `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
```

---

## Villumeðhöndlun

### Inntaksstaðfesting

```typescript
// lib/utils/validators.ts (bæta við)

/**
 * Staðfesta tímabilsinnslátt
 */
export function validatePeriod(period: Omit<Period, 'id'>): ValidationResult {
  const errors: Record<string, string> = {};

  // Nafn
  if (!period.name || period.name.trim() === '') {
    errors['name'] = 'Nafn má ekki vera tómt';
  }
  if (period.name.length > 100) {
    errors['name'] = 'Nafn má ekki vera lengra en 100 stafir';
  }

  // Ár
  if (period.year < 2020 || period.year > 2030) {
    errors['year'] = 'Ár verður að vera á milli 2020 og 2030';
  }

  // Mánuður
  if (period.month !== undefined && period.month !== null) {
    if (period.month < 1 || period.month > 12) {
      errors['month'] = 'Mánuður verður að vera á milli 1 og 12';
    }
  }

  // Tekjur
  if (period.income < 0) {
    errors['income'] = 'Tekjur geta ekki verið neikvæðar';
  }

  // Útgjöld
  Object.entries(period.spending).forEach(([key, value]) => {
    if (value < 0) {
      errors[`spending.${key}`] = `${SPENDING_CATEGORY_LABELS[key as SpendingCategory]} geta ekki verið neikvæðar`;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
```

### Villutilvik og svör

#### 1. Vantar raunverulegt tímakaup

**Ástand**: Notandi opnar Lífsstílsverðbólguskynir en hefur ekki fyllt út Tímakaups reiknivélina.

**Greining**: `results?.actualHourlyWage` er `undefined` eða `0`

**Svar**:
- Sýna upplýsingabox:
  ```
  ℹ️ Til að sjá lífsorgu kostnað þarftu að fylla fyrst út
     Raunverulega Tímakaups reiknivélina.
  ```
- Leyfa samt öllum virkni (útgjaldaskráning, greining)
- Fela lífsorgu gildi í niðurstöðum
- Sýna öll önnur gildi (króna upphæðir, prósentur, FI áhrif)

**Notendaboð**: "Fylltu út Tímakaups reiknivélina til að sjá lífsorgu kostnað"

**Endurheimt**: Notandi fyllir út Tímakaups reiknivélina → lífsorga gildi birtast

---

#### 2. Engin tímabil skráð

**Ástand**: Notandi opnar eiginleikann í fyrsta skipti.

**Greining**: `periods.length === 0`

**Svar**:
- Sýna "onboarding" skilaboð:
  ```
  Velkominn í Lífsstílsverðbólguskynjarann!

  Byrjaðu á að skrá fyrsta tímabilið þitt.
  Veldu mánuð eða ár og skráðu útgjöld þín eftir flokkum.
  ```
- Stór "Bæta við tímabili" hnappur
- Útskýrandi texti um tilgang eiginleikans

**Endurheimt**: Notandi skráir fyrsta tímabilið

---

#### 3. Aðeins eitt tímabil

**Ástand**: Notandi hefur skráð eitt tímabil en ekkert til að bera saman við.

**Greining**: `periods.length === 1`

**Svar**:
- Sýna tímabilið en engin greining
- Skilaboð:
  ```
  Skráðu annað tímabil til að sjá samanburð og greina lífsstílsverðbólgu.
  ```
- Hvatning til að skrá næsta tímabil

**Endurheimt**: Notandi skráir annað tímabil

---

#### 4. Ógilt inntak í tímabili

**Ástand**: Notandi reynir að vista tímabil með ógildri gögnum.

**Greining**: `validatePeriod()` skilar `isValid: false`

**Svar**:
- Sýna villuboð við viðkomandi reit
- Merkja villureit með rauðum ramma
- Hindra vistun þar til villur eru lagaðar
- Sýna villuyfirlit efst ef margar villur

**Notendaboð**: Sértæk villuboð við hvern reit

**Endurheimt**: Notandi leiðréttir innslættinn

---

#### 5. Eyðing tímabils fyrir slysni

**Ástand**: Notandi smellir á eyða takkann.

**Greining**: `onDeletePeriod(id)` kallað

**Svar**:
- Sýna staðfestingardialog:
  ```
  Eyða tímabili?

  Ertu viss um að þú viljir eyða "[period.name]"?
  Þessa aðgerð er ekki hægt að afturkalla.

  [Hætta við]  [Eyða]
  ```
- Eyða aðeins ef notandi staðfestir

**Endurheimt**: Engin (eyðing er varanleg)

---

## Prófunarstefna

### Einingarprófanir (Unit Tests)

#### Útreikningsföll

```typescript
describe('analyzeInflation', () => {
  const oldPeriod: Period = {
    id: '1',
    name: 'Jan 2024',
    month: 1,
    year: 2024,
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    income: 500000,
    spending: {
      housing: 150000,
      food: 80000,
      transportation: 30000,
      subscriptions: 10000,
      convenience: 15000,
      clothing: 10000,
      entertainment: 20000,
      health: 5000,
      other: 10000,
    },
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  };

  const newPeriod: Period = {
    ...oldPeriod,
    id: '2',
    name: 'Feb 2024',
    month: 2,
    income: 550000, // +10%
    spending: {
      ...oldPeriod.spending,
      food: 100000, // +25% (problematic)
      convenience: 25000, // +67% (critical)
    },
  };

  it('ætti að greina lífsstílsverðbólgu rétt', () => {
    const analysis = analyzeInflation(newPeriod, oldPeriod, 2000);

    expect(analysis.incomeChangePercent).toBeCloseTo(10, 1);
    expect(analysis.totalSpendingChangePercent).toBeGreaterThan(10);
    expect(analysis.lifestyleCreep).toBeGreaterThan(0);
  });

  it('ætti að greina flokka með stórar hækkanir', () => {
    const analysis = analyzeInflation(newPeriod, oldPeriod, 2000);

    const convenienceChange = analysis.categoryChanges.find(c => c.category === 'convenience');
    expect(convenienceChange?.severity).toBe('major');
  });

  it('ætti að búa til viðvaranir fyrir alvarleg tilvik', () => {
    const analysis = analyzeInflation(newPeriod, oldPeriod, 2000);

    expect(analysis.alerts.length).toBeGreaterThan(0);
    expect(analysis.alerts.some(a => a.type === 'critical')).toBe(true);
  });
});

describe('calculateFIImpact', () => {
  it('ætti að reikna FI seinkun rétt', () => {
    const impact = calculateFIImpact(10000, 500000); // +10.000 kr/mán, 500k tekjur

    expect(impact.increasedAnnualExpenses).toBe(120000);
    expect(impact.increasedFITarget).toBe(3000000); // 120k × 25
    expect(impact.fiDelayYears).toBeGreaterThan(0);
  });

  it('ætti að reikna framtíðarvirði rétt', () => {
    const impact = calculateFIImpact(1000, 500000);

    // FV formúla við 7% í 10 ár
    expect(impact.lostFutureValue10Years).toBeGreaterThan(0);
    expect(impact.lostFutureValue20Years).toBeGreaterThan(impact.lostFutureValue10Years);
  });
});

describe('calculateSalaryUtilization', () => {
  it('ætti að meta heilbrigða nýtingu', () => {
    const util = calculateSalaryUtilization(100000, 20000); // 20% í lífsstíl
    expect(util.status).toBe('healthy');
    expect(util.utilizationPercent).toBe(20);
  });

  it('ætti að greina alvarlega nýtingu', () => {
    const util = calculateSalaryUtilization(100000, 90000); // 90% í lífsstíl
    expect(util.status).toBe('critical');
  });
});
```

---

### Samþættingarprófanir (Integration Tests)

#### Context stjórnun

```typescript
describe('CalculatorContext - Lifestyle Inflation', () => {
  it('ætti að bæta við tímabili', () => {
    const { result } = renderHook(() => useCalculator(), {
      wrapper: CalculatorProvider,
    });

    act(() => {
      result.current.addPeriod({
        name: 'Jan 2024',
        month: 1,
        year: 2024,
        income: 500000,
        spending: getEmptySpending(),
      });
    });

    expect(result.current.periods).toHaveLength(1);
  });

  it('ætti að greina lífsstílsverðbólgu sjálfkrafa', () => {
    const { result } = renderHook(() => useCalculator(), {
      wrapper: CalculatorProvider,
    });

    // Bæta við tveimur tímabilum
    act(() => {
      result.current.addPeriod(createTestPeriod('Jan 2024', 500000));
      result.current.addPeriod(createTestPeriod('Feb 2024', 600000));
    });

    expect(result.current.inflationAnalysis).toBeDefined();
    expect(result.current.inflationAnalysis?.lifestyleCreep).toBeDefined();
  });

  it('ætti að uppfæra greining þegar tímabili breytt', () => {
    const { result } = renderHook(() => useCalculator(), {
      wrapper: CalculatorProvider,
    });

    act(() => {
      result.current.addPeriod(createTestPeriod('Jan 2024', 500000));
      result.current.addPeriod(createTestPeriod('Feb 2024', 500000));
    });

    const firstAnalysis = result.current.inflationAnalysis;

    act(() => {
      result.current.updatePeriod(result.current.periods[1].id, {
        income: 600000,
      });
    });

    expect(result.current.inflationAnalysis).not.toEqual(firstAnalysis);
  });
});
```

---

### End-to-End prófanir (E2E)

```typescript
test('Notandi getur skráð tímabil og séð lífsstílsverðbólgu', async ({ page }) => {
  await page.goto('/lifestyle-inflation');

  // 1. Skrá fyrsta tímabilið
  await page.click('text=Bæta við tímabili');
  await page.fill('input[name="name"]', 'Janúar 2024');
  await page.selectOption('select[name="month"]', '1');
  await page.fill('input[name="income"]', '500000');
  await page.click('button:has-text("Vista")');

  // 2. Skrá útgjöld
  await page.fill('input[name="food"]', '80000');
  await page.fill('input[name="housing"]', '150000');
  await page.click('button:has-text("Vista útgjöld")');

  // 3. Skrá annað tímabil
  await page.click('text=Bæta við tímabili');
  await page.fill('input[name="name"]', 'Febrúar 2024');
  await page.fill('input[name="income"]', '550000');
  await page.fill('input[name="food"]', '100000'); // Hækkun!
  await page.click('button:has-text("Vista")');

  // 4. Staðfesta að greining birtist
  await expect(page.locator('text=Lífsstílsverðbólga')).toBeVisible();
  await expect(page.locator('text=/\\d+\\.\\d+%/i')).toBeVisible();

  // 5. Staðfesta að viðvörun birtist
  await expect(page.locator('[data-testid="inflation-alert"]')).toBeVisible();
});
```

---

## Hönnunarákvarðanir

### Ákvörðun 1: Tímabilstengd hönnun (ekki dagleg skráning)

**Samhengi**: Hvernig eiga notendur að skrá útgjöld?

**Valkostir**:

1. **Dagleg skráning** (eins og expense tracker apps)
   - Kostir: Nákvæmt, ítarleg gögn
   - Gallar: Tímafrekt, leiðinlegt, hátt brotthvarf
   - Áhætta: Notendur hætta að skrá

2. **Tímabilstengd "snapshot"** (VALIÐ)
   - Kostir: Fljótlegt, auðvelt, lítið viðhald
   - Gallar: Minna nákvæmt, krefst þess að notandi muni útgjöld
   - Áhætta: Lítil - notendur geta slegið inn frá bankayfirlitum

**Ákvörðun**: Tímabilstengd hönnun

**Rökstuðningur**:
- YMOYL bókin mælir með mánaðarlegri skráningu, ekki daglegri
- Fólk á auðvelt með að rifja upp heildarútgjöld í flokkum
- Markmið er að greina þróun, ekki nákvæm dagleg fylgni
- Lægri aðgangshindrun → fleiri notendur

**Afleiðingar**:
- Period model með mánuði eða ári
- SpendingData sem heildarupphæðir fyrir hvern flokk
- Notendur geta slegið inn frá bankayfirliti/kreditkorti

**Kröfur sem þetta uppfyllir**: NS-1

---

### Ákvörðun 2: 9 flokkar (optimal jafnvægi)

**Samhengi**: Hversu margir útgjaldaflokkar?

**Valkostir**:

1. **Fáir flokkar (3-5)**
   - Kostir: Einfalt, fljótlegt
   - Gallar: Of almennt til að greina mynstur
   - Áhætta: Uppfyllir ekki NS-4

2. **9 flokkar** (VALIÐ)
   - Kostir: Gott jafnvægi, nægilega ítarlegt
   - Gallar: Sumir notendur vilja fleiri/færri
   - Áhætta: Lítil - "other" fangar það sem fellur ekki annað

3. **Margir flokkar (15+)**
   - Kostir: Mjög ítarlegt
   - Gallar: Yfirþyrmandi, "analysis paralysis"
   - Áhætta: Notendur hverfa

**Ákvörðun**: 9 flokkar

**Rökstuðningur**:
- Nær yfir algengustu útgjaldaflokka
- Samræmist öðrum FIRE tools
- "Other" veitir sveigjanleika
- Auðvelt að fylla út á 10-15 mínútum

**Afleiðingar**:
- SpendingCategory type með 9 gildum
- SPENDING_CATEGORY_LABELS og DESCRIPTIONS
- CategoryInput íhlutur fyrir hvern flokk

**Kröfur sem þetta uppfyllir**: NS-4

---

### Ákvörðun 3: Litakóðað verðbólguskor (fljótleg sjón)

**Samhengi**: Hvernig miðla alvarleika lífsstílsverðbólgu?

**Valkostir**:

1. **Aðeins prósentur**
   - Kostir: Nákvæmt
   - Gallar: Krefst túlkunar, ekki fljótvirkt
   - Áhætta: Notendur skilja ekki áhrif

2. **Litakóðað kerfi með þröskuldum** (VALIÐ)
   - Kostir: Fljótvirkt, auðskilið, aðgerðamiðað
   - Gallar: Þröskuldur getur verið handahófskenndur
   - Áhætta: Lítil - vel þekktur pattern

**Ákvörðun**: Grænt/gult/appelsínugult/rautt kerfi

**Rökstuðningur**:
- Samræmist almennum "health score" patterns
- Strax sýnilegt hvort aðgerða er þörf
- Litakóðun með textamerki (aðgengi)

**Afleiðingar**:
- InflationScore type
- calculateInflationScore() með skilgreindum þröskuldum
- InflationScoreDisplay íhlutur

**Kröfur sem þetta uppfyllir**: NS-2, NS-5

---

### Ákvörðun 4: Samþætting við CalculatorContext

**Samhengi**: Eiga tímabil að vera í aðskildum Context?

**Valkostir**:

1. **Aðskilinn LifestyleInflationContext**
   - Kostir: Betri aðskilnaður
   - Gallar: Flóknara, tvöföldun á localStorage
   - Áhætta: Sync vandamál

2. **Samþætting í CalculatorContext** (VALIÐ)
   - Kostir: Ein heimild, sjálfvirk uppfærsla, sameiginleg localStorage
   - Gallar: Stærri Context
   - Áhætta: Lítil

**Ákvörðun**: Samþætta í CalculatorContext

**Rökstuðningur**:
- Þarf actualHourlyWage fyrir lífsorgu útreikninga
- Eðlileg framhald af núverandi gögnum
- Ein localStorage vistun

**Afleiðingar**:
- CalculatorContext fær `periods: Period[]`
- CalculatorContext fær `inflationAnalysis: InflationAnalysis`
- StoredState uppfært með Period[]

**Kröfur sem þetta uppfyllir**: NS-2, NS-3

---

## Rekjanleiki við kröfur

### NS-1: Skrá útgjaldatímabil

**Hönnunarþættir**:
- Period model með SpendingData
- PeriodManager og PeriodForm íhlutir
- ExpenseTracker fyrir flokkaskráningu
- validatePeriod() staðfesting
- localStorage vistun

**Prófanir**:
- Unit: validatePeriod()
- Integration: Context CRUD
- E2E: Skrá tímabil → vista → sjá í lista

---

### NS-2: Greina lífsstílsverðbólgu

**Hönnunarþættir**:
- analyzeInflation() í lifestyleInflation.ts
- InflationAnalysis model
- InflationScoreDisplay íhlutur
- Litakóðað skor

**Prófanir**:
- Unit: analyzeInflation() með mismunandi sviðsmyndum
- Component: InflationScoreDisplay birtir rétt

---

### NS-3: Sjá FI áhrif

**Hönnunarþættir**:
- calculateFIImpact()
- FIImpact model
- FIImpactCard íhlutur
- calculateFutureValue() (endurnýtt)

**Prófanir**:
- Unit: calculateFIImpact() nákvæmni
- Component: FIImpactCard sýnir allar tölur

---

### NS-4: Sjá þróun með gröfum

**Hönnunarþættir**:
- TrendChart (línurit)
- CategoryBreakdownChart (súlurit)
- Recharts/Chart.js integration
- Responsive design

**Prófanir**:
- Component: Gröf render rétt
- E2E: Gröf birtast og uppfærast

---

### NS-5: Fá viðvaranir

**Hönnunarþættir**:
- generateAlerts()
- InflationAlert model
- InflationAlerts íhlutur
- getSuggestionsForCategory()

**Prófanir**:
- Unit: generateAlerts() býr til rétt
- Component: Viðvaranir birtast

---

### NS-6: Fá tillögur

**Hönnunarþættir**:
- getSuggestionsForCategory()
- Tillögur í InflationAlert
- Aðgerðamiðaðar viðvaranir

**Prófanir**:
- Unit: Tillögur fyrir hvern flokk
- Component: Tillögur birtast

---

### NS-7: Bera saman við tekjubreytingar

**Hönnunarþættir**:
- calculateSalaryUtilization()
- SalaryUtilization model
- SalaryUtilizationCard íhlutur

**Prófanir**:
- Unit: calculateSalaryUtilization()
- Component: Card sýnir nýtingu

---

### NS-8: Farsímavæn

**Hönnunarþættir**:
- Responsive Tailwind classes
- Mobile-first design
- Touch-friendly controls
- Scrollable gröf

**Prófanir**:
- E2E: Prófað á farsíma viewports

---

## Samantekt

Lífsstílsverðbólguskynjarinn er heildstæður eiginleiki sem hjálpar notendum að greina og stjórna lífsstílsverðbólgu. Með tímabilatengdri hönnun, litakóðuðum skoram, og aðgerðamiðuðum viðvörunum veitir hann notendum verkfæri til að halda útgjöldum í skefjum og ná fjárhagslegu frelsi hraðar.

**Lykilstyrkir**:
- Einföld tímabilstengd skráning
- Sjálfvirk greining og viðvaranir
- Skýr FI áhrif sýnd í lífsorgu og krónum
- Aðgerðamiðaðar tillögur fyrir hvern flokk
- Samþætt við núverandi Context

**Næstu skref**: Sjá tasks.md fyrir útfærsluskipulag.
