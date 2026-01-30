# Honnunarskjal: Vinnuthreytukostnadur

## Yfirlit

**Eiginleiki**: Vinnuthreytukostnadur (Work Convenience Tracker)
**Forrit**: peninganaedalifid.is
**Krofuskjal**: [requirements.md](./requirements.md)

### Samantekt

Vinnuthreytukostnadurinn er tracker sem hjalpar notendum ad sja raunverulegan kostnag vinnuthreyta - "threytuskatturinn" sem vid greidum thegar vid erum of threyttir til ad elda, fara med strafi, eda taka skynsamar akvarganir.

Eiginleikinn byggir a nuverandi Raunverulega Timakaups reiknivelinni og notar `actualHourlyWage` til ad umbreyta threytukostnaJi i merkingarbser gildi:
- **4.500 kr heimsending** verdur **2,4 klukkustundir** af thinni liffsorgu
- **18.000 kr/man i threytuskatti** gatud ordid **234.000 kr a ari**
- **Medaltal vinnudags 3.200 kr vs fridags 800 kr** = **124.800 kr/ar i hidden kostnaJi**

### Kjarnaforsendur

1. **Client-only arkitekturt**: Engar netbeidnir, oll gogn i localStorage
2. **Samtthing med adalreiknivel**: Notar sama Context og `actualHourlyWage`
3. **Fljot skr ning**: Minimalisti UI fyrir ad skra kostnag a faum sekund um
4. **Islenskt samhengi**: Algengar islendar thjonustur med raunverulegum verdum
5. **Vinnudagar samanburđur**: Lykilinnsyn - hversu mikid kostar vinnuthreyta raunverrulega?
6. **Markmi đs stjor nun**: Hjalpar notendum ad draga ur threytuskattinum

### Lykilihlutir

- **ConvenienceExpenseTracker**: Adalreiknivel med summary, lista og markmi di
- **QuickAddExpense**: Flytival fyrir fljota skr ningu
- **ExpenseList**: Listi yfir alla threytukostnaJ med edit/delete
- **WorkdayComparison**: Samanburđur vinnudaga vs fridaga
- **CategoryBreakdown**: Sundurliđun eftir flokkum
- **GoalProgress**: Markmi đs framvinda og sparnađur

### Tæknistafl

- **React** + **TypeScript**: Fyrir UI ihluti med tegundaoryggi
- **Context API**: Sameiginleg stodustjornun med adalreiknivel
- **localStorage**: Vistun gagna (engin backend)
- **Tailwind CSS**: Samramd stilsetning
- **date-fns**: Dagsetningar medhondlun (lightweight)

### Lykilutreikningar

```typescript
// Liffsorga kostnadur
lifeEnergyHours = expense / actualHourlyWage

// Medaltal vinnudagar vs fridagar
avgWorkday = sumWorkdayExpenses / countWorkdays
avgWeekend = sumWeekendExpenses / countWeekends
annualImpact = (avgWorkday - avgWeekend) × 52 weeks × 5 workdays

// Annualized kostnadur
annualizedExpense = monthlyAverage × 12
```

### Honnunarakkvorđanir

Sex meginakvorğanir motuđu honnunina:

1. **Samtthing i CalculatorContext** (ekki adskilinn Context)
2. **Sjalfvirk vinnudagur greining** med handvirkri override moguleika
3. **6 flokkar threytukostnaJar** (optimal jafnvaegi)
4. **Harđkođađar forstillingar** fyrir islenskar thjonustur
5. **30-daga gluggi** fyrir manadar statistics
6. **Einfold markmi đs stjor nun** (eitt managarlegt markmi d)

### Stađa utfaerslu

**Thegar utfaert**:
- TypeScript tegundir buar til
- Utreikningsfall skilgreind
- Context uppfaerđur

**Eftirstođvar utfaerslu**:
- UI ihlutir (6 ihlutir ad bua til)
- Stadfestingar (`validateConvenienceExpense`)
- Villumedh ondlun og notendaboð
- Profanir (unit, integration, E2E)
- Adgengismal (ARIA labels, keyboard navigation)

## Arkitektúr

### Yfirlit kerfis

Vinnuthreytukostnadurinn er samttaetter eiginleiki sem byggir a nuverandi Raunverulega Timakaups reiknivelinni. Hann notar `actualHourlyWage` gildid til ad umbreyta threytukostnaJi i liffsorgu (klukkustundir) og syrnir samanburđ a vinnudogum vs fridogum.

**Kjarnaregla**: Oll gogn eru geymd a vidmotshlið (client-side) i localStorage, engar netbeidnir eru gerđar.

### Arkitektúr ihluta

```
┌─────────────────────────────────────────────────────────────────┐
│                         Vafri (Browser)                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                React Forrit (Application)                  │  │
│  │                                                            │  │
│  │  ┌──────────────────────────────────────────────────────┐ │  │
│  │  │           CalculatorContext (Sameiginlegt)           │ │  │
│  │  │  - Tekjuinnslattur                                   │ │  │
│  │  │  - Utreikningur a actualHourlyWage                   │ │  │
│  │  │  - ConvenienceExpenses[]                             │ │  │
│  │  │  - ConvenienceGoal                                   │ │  │
│  │  │  - localStorage stjornun                             │ │  │
│  │  └────────────────┬─────────────────────────────────────┘ │  │
│  │                   │                                        │  │
│  │  ┌────────────────┼────────────────────────────────────┐  │  │
│  │  │                │                                     │  │  │
│  │  │  ┌─────────────▼──────────┐  ┌──────────────────┐   │  │  │
│  │  │  │ Adalreiknivel          │  │ Threytukostnaður │   │  │  │
│  │  │  │ (Wage Calculator)      │  │ Tracker          │   │  │  │
│  │  │  │                        │  │                  │   │  │  │
│  │  │  │ - Tekjuinnslattur      │  │ - Quick Add      │   │  │  │
│  │  │  │ - Kostnadarinnslattur  │  │ - Expense List   │   │  │  │
│  │  │  │ - Nidurstad ur         │  │ - Statistics     │   │  │  │
│  │  │  │ - actualHourlyWage ────┼─▶│ - Liffsorga      │   │  │  │
│  │  │  └────────────────────────┘  │ - Workday vs Off │   │  │  │
│  │  │                               │ - Goal Progress  │   │  │  │
│  │  │                               └──────────────────┘   │  │  │
│  │  │                                                       │  │  │
│  │  │  ┌────────────────────────────────────────────────┐  │  │  │
│  │  │  │      Utreikningavel (Calculations)             │  │  │  │
│  │  │  │  - convenienceExpenses.ts (nytt)               │  │  │  │
│  │  │  │    * calculateExpenseSummary()                 │  │  │  │
│  │  │  │    * calculateWorkdayComparison()              │  │  │  │
│  │  │  │    * calculateGoalProgress()                   │  │  │  │
│  │  │  │  - lifeEnergy.ts (nuverandi)                   │  │  │  │
│  │  │  │    * dollarsToLifeEnergy()                     │  │  │  │
│  │  │  └────────────────────────────────────────────────┘  │  │  │
│  │  │                                                       │  │  │
│  │  │  ┌────────────────────────────────────────────────┐  │  │  │
│  │  │  │      Gagnalag (Data Layer)                     │  │  │  │
│  │  │  │  - localStorage med ConvenienceExpense[]       │  │  │  │
│  │  │  │  - JSON export/import (med kostnaJi)           │  │  │  │
│  │  │  └────────────────────────────────────────────────┘  │  │  │
│  │  └───────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Gagnaflæđi

1. **Notandi skrar tekjur** i adalreiknivelinni → `actualHourlyWage` er reiknađ
2. **Notandi baetir vid threytukostnaJi** → Vidbót vid `convenienceExpenses[]` array i Context
3. **Utreikningur keyrir sjalfkrafa** (useMemo):
   - Heildar viku/manadar/ars kostnadur
   - Liffsorga → `lifeEnergyHours` (notar `actualHourlyWage`)
   - Vinnudagar vs fridagar samanburđur
   - Flokkasundurliđun
   - Markmi đs framvinda
4. **Nidurstoður birtast** i rauntima i ConvenienceExpenseTracker ihlutinum
5. **Gogn vistuđu** sjalfkrafa i localStorage (debounced 500ms)

### Samttaettingarpunktar

**Med Raunverulegu Timakaups reiknivelinni**:
- Deilir sama `CalculatorContext`
- Notar `results.actualHourlyWage` fyrir liffsorgu utreikninga
- Ef `actualHourlyWage` er 0 ega undefined → synja skilaboJ um ad fylla ut adalreikniveling fyrst

**Med localStorage**:
- Baett vid `convenienceExpenses: ConvenienceExpense[]` og `convenienceGoal?: ConvenienceGoal` i `StoredState`
- Flyst med export/import virkni
- Sama utgafustjornun (version number)

### Tæknival

**Nuverandi tækni (endurnott)**:
- **React**: Fyrir UI ihluti
- **TypeScript**: Fyrir tegundaoryggi
- **Context API**: Fyrir stjornun a stođu
- **localStorage**: Fyrir geymslu gagna
- **Tailwind CSS**: Fyrir stilsetningu

**Ny virkni**:
- **date-fns**: Lightweight dagsetningar library fyrir dagsetningar medhondlun
- **Vinnudagur greining**: Sjalfvirk greining Ma-Fo vs La-Su
- **Threytuskatt analytics**: Vinnudagar vs fridagar samanburđur

**Akvorđun**: Bafa vid date-fns fyrir dagsetningar (4.5kb gzipped) - ekkert thyngra library.

### Mappubygging

```
apps/peninganaedalifid/
├── src/
│   ├── app/
│   │   └── page.tsx                     # Adalsida med ollum reiknivelar
│   │
│   ├── components/
│   │   ├── calculator/                  # Nuverandi ihlutir
│   │   │   └── ...
│   │   │
│   │   └── convenience/                 # NYTT: Threytukostnadar ihlutir
│   │       ├── ConvenienceExpenseTracker.tsx   # Adal ihlut
│   │       ├── QuickAddExpense.tsx             # Fljot skraning
│   │       ├── ExpenseList.tsx                 # Listi kostnadar
│   │       ├── ExpenseItem.tsx                 # Einstakur kostnadur
│   │       ├── WorkdayComparison.tsx           # Vinnudagar vs fridagar
│   │       ├── CategoryBreakdown.tsx           # Sundurliđun eftir flokkum
│   │       └── GoalProgress.tsx                # Markmi đs framvinda
│   │
│   ├── lib/
│   │   ├── calculations/
│   │   │   ├── convenienceExpenses.ts   # NYTT
│   │   │   ├── lifeEnergy.ts           # Nuverandi (endurnott)
│   │   │   └── ...
│   │   │
│   │   └── utils/
│   │       ├── formatters.ts           # Baeta vid ISK formottun
│   │       └── dateUtils.ts            # NYTT: Vinnudagur helpers
│   │
│   ├── context/
│   │   └── CalculatorContext.tsx        # UPPFAERT med threytukostnaJi
│   │
│   └── types/
│       └── calculator.ts                # UPPFAERT med convenience tegundum
│
└── ...
```

## Ihlutir og vidmot

### Sidautlit

**Desktop utlit (> 768px)**:

```
┌─────────────────────────────────────────────────────────────────┐
│  Haus (Header)                                      [Flytja ut] │
│  peninganaedalifid.is - Liffsorgu reiknivel                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Raunverulega Timakaups Reiknivel                       │   │
│  │  → Skilar actualHourlyWage                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  VINNUTHREYTUKOSTNAÐUR                                   │   │
│  │                                                           │   │
│  │  ┌───────────────────────────────────────────────────┐   │   │
│  │  │  Fljot skraning                                    │   │   │
│  │  │  [Flytival: Wolt heimsending ▼] [+ Skra]          │   │   │
│  │  └───────────────────────────────────────────────────┘   │   │
│  │                                                           │   │
│  │  ┌───────────────────────────────────────────────────┐   │   │
│  │  │  Yfirlit                                           │   │   │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐    │   │   │
│  │  │  │ Vika     │  │ Manudur  │  │ Ar (annadat) │    │   │   │
│  │  │  │ 8.400 kr │  │ 18.000kr │  │ 216.000 kr   │    │   │   │
│  │  │  │ 4,4 klst │  │ 9,5 klst │  │ 57,1 dagar   │    │   │   │
│  │  │  └──────────┘  └──────────┘  └──────────────┘    │   │   │
│  │  └───────────────────────────────────────────────────┘   │   │
│  │                                                           │   │
│  │  ┌───────────────────────────────────────────────────┐   │   │
│  │  │  Vinnudagar vs Fridagar                            │   │   │
│  │  │  Vinnudagur: 3.200 kr  ████████████░░              │   │   │
│  │  │  Fridagur:     800 kr  ███░░░░░░░░░░░              │   │   │
│  │  │  Mismunur: 2.400 kr/dag → 124.800 kr/ar           │   │   │
│  │  └───────────────────────────────────────────────────┘   │   │
│  │                                                           │   │
│  │  ┌───────────────────────────────────────────────────┐   │   │
│  │  │  Markmi d: 15.000 kr/man                           │   │   │
│  │  │  Framvinda: ████████████████████░░ 83% (12.450kr)  │   │   │
│  │  │  Sparnadur: 2.550 kr (1,3 klst)                    │   │   │
│  │  │  Arsparnadur: 30.600 kr ef nad                     │   │   │
│  │  └───────────────────────────────────────────────────┘   │   │
│  │                                                           │   │
│  │  ┌───────────────────────────────────────────────────┐   │   │
│  │  │  Flokkasundurliđun (sidasta 30 daga)               │   │   │
│  │  │  Heimsending (8)         9.200 kr  51%            │   │   │
│  │  │  Leigubill (4)          4.800 kr  27%            │   │   │
│  │  │  Tilbuinn matur (6)      3.000 kr  17%            │   │   │
│  │  │  Mathus (1)              1.000 kr   5%            │   │   │
│  │  └───────────────────────────────────────────────────┘   │   │
│  │                                                           │   │
│  │  ┌───────────────────────────────────────────────────┐   │   │
│  │  │  Nylegt (sidasta 7 daga)                           │   │   │
│  │  │  ┌──────────────────────────────────────────────┐ │   │   │
│  │  │  │ I dag - Wolt heimsending     4.500 kr  [✏️][🗑️]│ │   │   │
│  │  │  │ Vinnudagur                                   │ │   │   │
│  │  │  └──────────────────────────────────────────────┘ │   │   │
│  │  │  ┌──────────────────────────────────────────────┐ │   │   │
│  │  │  │ I gier - Hreyfill heim       3.200 kr  [✏️][🗑️]│ │   │   │
│  │  │  │ Vinnudagur                                   │ │   │   │
│  │  │  └──────────────────────────────────────────────┘ │   │   │
│  │  │  [Synja allt...]                                   │   │   │
│  │  └───────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  Fotur (Footer)                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Farsima utlit (< 768px)**:

```
┌─────────────────────────┐
│  Haus         [☰ Valmynd]│
├─────────────────────────┤
│  Vinnuthreytukostnadur  │
│                         │
│  [Flytival ▼] [+ Skra] │
│                         │
│  ┌─────────────────────┐│
│  │ Manudur             ││
│  │ 18.000 kr           ││
│  │ 9,5 klst            ││
│  └─────────────────────┘│
│                         │
│  ┌─────────────────────┐│
│  │ Vinnudagur: 3.200kr ││
│  │ Fridagur: 800 kr    ││
│  │ Mismunur: 2.400 kr  ││
│  └─────────────────────┘│
│                         │
│  ┌─────────────────────┐│
│  │ Markmi d: 15.000 kr ││
│  │ ███████████████░ 83%││
│  │ Sparnadur: 2.550 kr ││
│  └─────────────────────┘│
│                         │
│  Nylegt                 │
│  ┌─────────────────────┐│
│  │ I dag               ││
│  │ Wolt 4.500kr [✏️][🗑️]││
│  └─────────────────────┘│
│  [Synja meira...]       │
│                         │
├─────────────────────────┤
│  Fotur                  │
└─────────────────────────┘
```

### Lykilihlutir

#### 1. ConvenienceExpenseTracker

**Tilgangur**: Adal ihlut sem syrnir allan tracker med summary, lista og markmi di.

**Abyrgd**:
- Sækir threytukostnad ur Context
- Syrnir heildaryfirlit (vika, manudur, ar)
- Stjornar syn a undirhluta
- Syrnir vidvorunarbo d ef actualHourlyWage vantar

**Opinbert vidmot**:
```typescript
interface ConvenienceExpenseTrackerProps {
  className?: string;
}
```

**Framkvaemdaatri đi**:
- Syrnir placeholder ef actualHourlyWage = 0
- Notar Card ihlut fyrir samkvemt utlit
- Rauntima uppfaersla (useMemo i Context)

---

#### 2. QuickAddExpense

**Tilgangur**: Flytival og form fyrir fljota skr ningu threytukostnadar.

**Abyrgd**:
- Flytival med algengum islenskum thjonustum
- Fljott form med minimal innslattur
- Vista vid Context
- Sjalfvirk vinnudagur greining

**Opinbert vidmot**:
```typescript
interface QuickAddExpenseProps {
  onAdd: (expense: Omit<ConvenienceExpense, 'id'>) => void;
}
```

**Framkvaemdaatri đi**:
- Dropdown med COMMON_CONVENIENCE_EXPENSES
- Dagsetning sjalgefid = i dag
- Sjalfvirk vinnudagur greining (Ma-Fo = true)
- Allow override fyrir holidays/vacation days

---

#### 3. ExpenseList

**Tilgangur**: Syrnir lista yfir allan threytukostnad.

**Abyrgd**:
- Syrnir alla kostnad (nylegt fyrst)
- Flokkar eftir dags (i dag, i gier, sidas ta vika, o.s.frv.)
- Edit/delete virkni
- Filter: allir, adens vinnudagar, adens fridagar

**Opinbert vidmot**:
```typescript
interface ExpenseListProps {
  expenses: ConvenienceExpense[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  maxVisible?: number; // Default 7
}
```

---

#### 4. ExpenseItem

**Tilgangur**: Syrnir einstakar threytukostnað i listanum.

**Abyrgd**:
- Syna upphad, flokkur, dagsetning
- Syjna athugasemd ef til
- Synja vinnudagur/fridagur badge
- Edit og delete takkar

**Opinbert vidmot**:
```typescript
interface ExpenseItemProps {
  expense: ConvenienceExpense;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}
```

---

#### 5. WorkdayComparison

**Tilgangur**: Syrnir samanburđ a vinnudogum vs fridogum.

**Abyrgd**:
- Reikna medaltal vinnudags vs fridags
- Synja mismun (kr og %)
- Synja arsahrif munsins
- Visual bar chart samanburđur

**Opinbert vidmot**:
```typescript
interface WorkdayComparisonProps {
  comparison: WorkdayComparisonData;
}
```

---

#### 6. CategoryBreakdown

**Tilgangur**: Syrnir sundurliđun eftir flokkum.

**Abyrgd**:
- Synja hvern flokk med samtolu
- Rađđad eftir kostnaJi (haestur fyrst)
- Synja prosenta af heildar
- Fjoldi tilfella i hverjum flokki

**Opinbert vidmot**:
```typescript
interface CategoryBreakdownProps {
  breakdown: CategoryBreakdownData[];
  total: number;
}
```

---

#### 7. GoalProgress

**Tilgangur**: Syrnir markmi đs framvindu og sparnađ.

**Abyrgd**:
- Synja managarlegt markmi d
- Progress bar med % framvindu
- Synja sparnađ (ef nad)
- Synja arsahrif sparnađar
- Leyfa ad breyta ega eyda markmidi

**Opinbert vidmot**:
```typescript
interface GoalProgressProps {
  goal?: ConvenienceGoal;
  currentMonthly: number;
  onUpdateGoal: (goal: ConvenienceGoal) => void;
  onDeleteGoal: () => void;
}
```

## Gagnalikon

### Kjarnabreytingar

#### ConvenienceExpense

```typescript
/**
 * Einstakur threytukostnadur
 */
export interface ConvenienceExpense {
  id: string;                           // Einstakt auđkenni (generađ)
  amount: number;                       // Upphađ i ISK
  category: ConvenienceCategory;        // Flokkur
  date: string;                         // ISO dagsetning
  isWorkday: boolean;                   // Hvort dagur var vinnudagur
  note?: string;                        // Valfrjals athugasemd
}
```

**Stadfestingarreglur**:
- `amount`: Verdur ad vera > 0
- `category`: Einn af 6 gildum flokkunum
- `date`: Gild ISO dagsetning
- `isWorkday`: Boolean (sjalfvirkt greint, en getum override)
- `note`: Valfrjals, hamark 200 stafir

---

#### ConvenienceCategory

```typescript
/**
 * Flokkar fyrir threytukostnad
 */
export type ConvenienceCategory =
  | 'delivery'     // Heimsending (Wolt, AHA, o.s.frv.)
  | 'taxi'         // Leigubill (Hreyfill, Bolt, o.s.frv.)
  | 'prepared'     // Tilbuinn matur (10-11, Bonus, o.s.frv.)
  | 'restaurant'   // Mathus
  | 'impulse'      // Kaup i vinnu (impulse purchases)
  | 'other';       // Annat
```

**Islensku merki**:
```typescript
export const CONVENIENCE_CATEGORY_LABELS: Record<ConvenienceCategory, string> = {
  delivery: 'Heimsending',
  taxi: 'Leigubill',
  prepared: 'Tilbuinn matur',
  restaurant: 'Mathus',
  impulse: 'Kaup i vinnu',
  other: 'Annat',
};
```

---

#### ConvenienceExpenseSummary

```typescript
/**
 * Samantekt a threytukostnaJi med utreikningum
 */
export interface ConvenienceExpenseSummary {
  totalWeekly: number;                  // Heildar vikukostnadur (sidasta 7 daga)
  totalMonthly: number;                 // Heildar managarkostnadur (sidasta 30 daga)
  totalAnnualized: number;              // Arshreistad (monthly × 12)

  lifeEnergyWeekly: number;             // Liffsorgu klukkustundir viku
  lifeEnergyMonthly: number;            // Liffsorgu klukkustundir manadar
  lifeEnergyAnnualized: number;         // Liffsorgu dagar ars

  workdayAverage: number;               // Medaltal vinnudags
  weekendAverage: number;               // Medaltal fridags
  workdayPremium: number;               // Mismunur (workday - weekend)
  annualWorkdayPremium: number;         // Arsahrif munsins

  byCategory: {
    category: ConvenienceCategory;
    label: string;
    total: number;
    count: number;
    percentage: number;
  }[];
}
```

---

#### ConvenienceGoal

```typescript
/**
 * Managarlegt markmi d fyrir threytukostnad
 */
export interface ConvenienceGoal {
  monthlyTarget: number;                // Markmi d i ISK/man
  startDate: string;                    // ISO dagsetning thegar markmidi byrjar
}
```

---

#### StoredState (Uppfaert)

```typescript
/**
 * Fullt app state sem vistađ er i localStorage
 */
export interface StoredState {
  version: number;
  currentInputs: CalculatorInputs;
  scenarios: Scenario[];
  subscriptions: Subscription[];
  convenienceExpenses: ConvenienceExpense[];     // NYTT
  convenienceGoal?: ConvenienceGoal;             // NYTT
  lastUpdated: string;
}
```

---

### Sjalfgefin gildi

```typescript
export const DEFAULT_CONVENIENCE_EXPENSE: Omit<ConvenienceExpense, 'id'> = {
  amount: 0,
  category: 'other',
  date: new Date().toISOString(),
  isWorkday: isWeekday(new Date()),
  note: '',
};

export const DEFAULT_CONVENIENCE_GOAL: ConvenienceGoal = {
  monthlyTarget: 15000,
  startDate: new Date().toISOString(),
};
```

---

### Algengar threytukostnadar (Forstillingar)

```typescript
export const COMMON_CONVENIENCE_EXPENSES: Omit<ConvenienceExpense, 'id' | 'date' | 'isWorkday'>[] = [
  // Heimsending
  { amount: 4500, category: 'delivery', note: 'Wolt heimsending' },
  { amount: 3800, category: 'delivery', note: 'AHA heimsending' },
  { amount: 3200, category: 'delivery', note: 'Dominos pizza' },

  // Leigubill
  { amount: 3500, category: 'taxi', note: 'Hreyfill heim fra vinnu' },
  { amount: 2000, category: 'taxi', note: 'Hreyfill stutt' },
  { amount: 5000, category: 'taxi', note: 'Hreyfill langt' },

  // Tilbuinn matur
  { amount: 1500, category: 'prepared', note: '10-11 tilbuinn matur' },
  { amount: 1800, category: 'prepared', note: 'Bonus tilbuinn matur' },
  { amount: 2200, category: 'prepared', note: 'Netto tilbuinn matur' },

  // Mathus
  { amount: 2500, category: 'restaurant', note: 'Skyndibit' },
  { amount: 4000, category: 'restaurant', note: 'Mathus hadag' },

  // Kaup i vinnu
  { amount: 3000, category: 'impulse', note: 'Amazon kaup' },
  { amount: 2000, category: 'impulse', note: 'Verslun kaup' },
];
```

## Villumedhondlun

### Inntaksstadfesting

```typescript
/**
 * Stadfesta threytukostnadar innslattur
 */
export function validateConvenienceExpense(
  expense: Omit<ConvenienceExpense, 'id'>
): ValidationResult {
  const errors: Record<string, string> = {};

  // Upphad
  if (expense.amount <= 0) {
    errors['amount'] = 'Upphad verdur ad vera haerri en 0 kr';
  }
  if (isNaN(expense.amount)) {
    errors['amount'] = 'Upphad verdur ad vera tala';
  }
  if (expense.amount > 100000) {
    errors['amount'] = 'Upphad virdist oraunhaeft (> 100.000 kr)';
  }

  // Dagsetning
  const date = new Date(expense.date);
  if (isNaN(date.getTime())) {
    errors['date'] = 'Ogild dagsetning';
  }
  if (date > new Date()) {
    errors['date'] = 'Dagsetning getur ekki verid i framtidinni';
  }

  // Flokkur
  const validCategories: ConvenienceCategory[] = [
    'delivery',
    'taxi',
    'prepared',
    'restaurant',
    'impulse',
    'other',
  ];
  if (!validCategories.includes(expense.category)) {
    errors['category'] = 'Ogildur flokkur';
  }

  // Athugasemd
  if (expense.note && expense.note.length > 200) {
    errors['note'] = 'Athugasemd ma ekki vera lengri en 200 stafir';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
```

### Villutilvik og svor

#### 1. Vantar raunverulegt timakaup

**Astand**: Notandi opnar Threytukostnadar Tracker en hefur ekki fyllt ut Timakaups reikniveling.

**Greining**: `results?.actualHourlyWage` er `undefined` ega `0`

**Svar**:
- Synja vidvorunarbox:
  ```
  ⚠️ Til ad sja liffsorgu kostnag tharftu ad fylla fyrst ut
     Raunverulega Timakaups reikniveling hér ad ofan.
  ```
- Syjna samt ISK upphađir
- Fela liffsorgu gildi
- Leyfa samt ad baeta vid kostnaJi

**Notendabod**: "Fylltu fyrst ut Timakaups reikniveling til ad sja liffsorgu kostnag"

---

#### 2. Ogilt inntak i eydublaJi

**Astand**: Notandi reynir ad vista kostnag med ogildri gognum.

**Greining**: `validateConvenienceExpense()` skilar `isValid: false`

**Svar**:
- Synja villubod vid vidkomandi reit
- Merkja villureit med rauum ramma
- Hindra vistun thar til villur eru lagadar

---

#### 3. Eyding kostnadar fyrir slysni

**Astand**: Notandi smellir a eyda takkann.

**Greining**: `onDelete(id)` kallad

**Svar**:
- Synja stadfestingardialog:
  ```
  Eyda kostnaJi?

  Ertu viss um ad thu viljir eyda thessum kostnaJi?
  Thessa adgerd er ekki haegt ad afturkalla.

  [Haetta vid]  [Eyda]
  ```

## Profunarstefna

### Einingarprof anir (Unit Tests)

**Markmid**: Profa einstakar adferdir/foll i einangrun.

#### Utreikningsf oll

```typescript
describe('calculateExpenseSummary', () => {
  it('aetti ad reikna heildar viku/manadar/ars kostnag rett', () => {
    // Test implementation
  });

  it('aetti ad reikna liffsorgu rett', () => {
    // Test implementation
  });

  it('aetti ad flokka rett eftir category', () => {
    // Test implementation
  });
});

describe('calculateWorkdayComparison', () => {
  it('aetti ad reikna medaltal vinnudaga vs fridaga rett', () => {
    // Test implementation
  });

  it('aetti ad reikna arsahrif munsins rett', () => {
    // Test implementation
  });
});

describe('isWeekday', () => {
  it('aetti ad greina Ma-Fo sem vinnudaga', () => {
    // Test implementation
  });

  it('aetti ad greina La-Su sem fridaga', () => {
    // Test implementation
  });
});
```

#### Stadfesting

```typescript
describe('validateConvenienceExpense', () => {
  it('aetti ad samthykkja gilt inntak', () => {
    // Test implementation
  });

  it('aetti ad hafna neikvaedum upphađum', () => {
    // Test implementation
  });

  it('aetti ad hafna framtidar dagsetningu', () => {
    // Test implementation
  });
});
```

---

### Samthættingarpr of anir (Integration Tests)

**Markmid**: Profa samskipti milli ihluta og Context.

#### Context stjornun

```typescript
describe('CalculatorContext - ConvenienceExpenses', () => {
  it('aetti ad baeta vid kostnaJi', () => {
    // Test implementation
  });

  it('aetti ad uppfaera kostnag', () => {
    // Test implementation
  });

  it('aetti ad eyda kostnaJi', () => {
    // Test implementation
  });

  it('aetti ad uppfaera summary thegar kostnaJi breytt', () => {
    // Test implementation
  });
});
```

---

### End-to-End profanir (E2E)

**Markmid**: Profa heildarflædi notenda.

#### Flædi: Baeta vid threytukostnaJi og sja arsahrif

```typescript
test('Notandi getur baett vid threytukostnaJi og sed arsahrif', async ({ page }) => {
  await page.goto('/');

  // 1. Fylla ut timakaups reikniving
  await page.fill('input[name="grossAnnualIncome"]', '6000000');

  // 2. Fara i threytukostnadar tracker
  await page.click('text=Vinnuthreytukostnadur');

  // 3. Baeta vid kostnaJi
  await page.selectOption('select[name="preset"]', 'Wolt heimsending');
  await page.click('button:has-text("Skra")');

  // 4. Stadfesta ad kostnadur birtist
  await expect(page.locator('text=Wolt heimsending')).toBeVisible();
  await expect(page.locator('text=4.500 kr')).toBeVisible();

  // 5. Stadfesta ad arsahrif birtast
  await expect(page.locator('text=/Ar \\(annađad\\)/i')).toBeVisible();
});
```

## Honnunarakkvorđanir

### Akvorđun 1: Samthetting med nuverandi Context

**Samhengi**: Threytukostnadar tracker tharf adgang ad `actualHourlyWage`.

**Valkostir**:
1. Adskilinn Context
2. Samthetting i nuverandi CalculatorContext (VALID)

**Akvorđun**: Samthætta i nuverandi CalculatorContext

**Rokstuđningur**:
- Tracker tharf actualHourlyWage
- Ein heimild sannleikans
- Sameiginleg localStorage stjornun

---

### Akvorđun 2: Sjalfvirk vinnudagur greining

**Samhengi**: Vid thurfu m ad vita hvort dagur er vinnudagur ega fridagur.

**Valkostir**:
1. Adens handvirk merking
2. Sjalfvirk greining med override (VALID)

**Akvorđun**: Sjalfvirk Ma-Fo greining med handvirkri override moguleika

**Rokstuđningur**:
- Flestir vinna Ma-Fo
- Fljotvirkni (engin extra clicks fyrir flestar skr ningar)
- Override virkni fyrir leyfisdaga, orlof, o.s.frv.

---

### Akvorđun 3: 6 flokkar threytukostnadar

**Samhengi**: Vid thurfu m ad flokka kostnad til ad greina mynstur.

**Valkostir**:
1. Einn "annat" flokkur
2. 6 flokkar (VALID)
3. 15+ flokkar

**Akvorđun**: 6 flokkar

**Rokstuđningur**:
- Naer yfir 90%+ af algengum threytukostnaJi
- Einfoeld val fyrir notanda
- Næg grein

---

### Akvorđun 4: 30-daga gluggi fyrir statistics

**Samhengi**: Vid thurfu m tidaglugg a fyrir manadarleg statistics.

**Valkostir**:
1. Sidustu 30 dagar (VALID)
2. Current kalendertismanudur
3. Seinustu 4 vikur

**Akvorđun**: Sidasta 30 daga

**Rokstuđningur**:
- Samkvæmt vid "manadar" skilgreining
- Rolling gluggi (alltaf fresh)
- Einfoeld utreikningar

---

### Akvorđun 5: Einfoeld markmi ds stjor nun

**Samhengi**: Vid viljum hjalpa notendum ad draga ur threytuskattinum.

**Valkostir**:
1. Engin markmi đs virkni
2. Eitt managarlegt markmi d (VALID)
3. Margir markmiđir (weekly, monthly, per category)

**Akvorđun**: Eitt managarlegt markmi d

**Rokstuđningur**:
- MVP simplicity
- Focus a einu markmi di
- Haegt ad utvikka siđar

## Rekjanleiki vid krofur

### NS-1: Skra threytukostnad fljott

**Honnunarthaettir**:
- QuickAddExpense ihlut med flytivali
- COMMON_CONVENIENCE_EXPENSES med islenskum thjonustum
- Minimal form fields

---

### NS-2: Sja arleg ahrif

**Honnunarthaettir**:
- ConvenienceExpenseSummary med weekly/monthly/annualized
- Liffsorgu utreikning ur med actualHourlyWage
- Visual cards med aherslum

---

### NS-3: Bera saman vinnudaga og fridaga

**Honnunarthaettir**:
- WorkdayComparison ihlut
- Sjalfvirk vinnudagur greining (isWeekday)
- Arsahrif calculation
- Visual bar chart

---

### NS-4: Flokka threytukostnad

**Honnunarthaettir**:
- 6 flokkar (delivery, taxi, prepared, restaurant, impulse, other)
- CategoryBreakdown ihlut
- Flokkur rađđađur eftir kostnaJi

---

### NS-5: Setja markmi d og fylgjast med framvindu

**Honnunarthaettir**:
- ConvenienceGoal gagnalikon
- GoalProgress ihlut med progress bar
- Sparnađur calculation

---

### NS-6: Flytival fyrir algengar athafnir

**Honnunarthaettir**:
- COMMON_CONVENIENCE_EXPENSES med ~12 algengum thjonustum
- QuickAddExpense med dropdown
- Forstilltar verdmagi (editable)

---

### Samantekt rekjanleika

| Krofur ID | Honnunarthaett ur | Stađa |
|----------|---------------|-------|
| NS-1 | QuickAddExpense + presets | ✅ Fullnaegandi |
| NS-2 | ExpenseSummary + annualization | ✅ Fullnaegandi |
| NS-3 | WorkdayComparison + analysis | ✅ Fullnaegandi |
| NS-4 | 6 categories + CategoryBreakdown | ✅ Fullnaegandi |
| NS-5 | ConvenienceGoal + GoalProgress | ✅ Fullnaegandi |
| NS-6 | COMMON_CONVENIENCE_EXPENSES | ✅ Fullnaegandi |
| Afkost | Sync calculations + debounce | ✅ Fullnaegandi |
| Adgengi | Semantic HTML + ARIA | ✅ Fullnaegandi |
| Personuvernd | Client-only + localStorage | ✅ Fullnaegandi |

**Nidurstaða**: Honnunin uppfyllir allar krofur sem skilgreindar eru i requirements.md.
