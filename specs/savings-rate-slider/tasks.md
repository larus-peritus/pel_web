# Verkefni: Sparnaðarhlutfall Reiknivél

## Yfirlit

**Eiginleiki**: Sparnaðarhlutfall Reiknivél (Savings Rate Slider)
**Forrit**: peninganaedalifid.is
**Kröfur**: [requirements.md](./requirements.md)
**Hönnun**: [design.md](./design.md)
**Fasi**: 2.2.1 (Sparnaðarreiknivélar)

## Forsendur

Áður en byrjað er á þessum verkefnum:
- [x] Verkefni er frumstillt (Next.js + React + TypeScript + Tailwind)
- [x] Grunnur UI íhlutir eru til (Input, Button, Card, Slider)
- [x] Gagnavarðveislulag er til staðar (localStorage hooks)
- [x] CalculatorContext er til og virkar
- [x] Raunverulegt Tímakaups reiknivél er útfærð (veitir actualHourlyWage)

## Verkefnastig

### Grunnur (Verkefni 1-3): TypeScript týpur, útreikningar, samhengi
### Aðal Eiginleikar (Verkefni 4-7): UI íhlutir, rennislá, niðurstöður
### Ítarlegir Eiginleikar (Verkefni 8-11): Ferill, atburðarásir, framvinda
### Fágering (Verkefni 12-13): Farsímaútgáfa, próf, betringar

---

## Verkefni 1: Búa til TypeScript týpur fyrir FI útreikninga

**Staða**: [ ] Ekki byrjað
**Flækjustig**: Einfalt
**Háðir**: Engin
**Tími**: 1-2 klst

### Lýsing
Skilgreina allar TypeScript týpur og viðmót (interfaces) fyrir FI (Financial Independence) reiknivélina.

### Samþykktarviðmið
- [ ] Allar týpur úr design.md útfærðar í `src/types/calculator.ts`
- [ ] FIInputs, FIResults, FIScenario, FISnapshot interfaces skilgreindar
- [ ] FICurveDataPoint og WhatIfScenario interfaces skilgreindar
- [ ] Týpur útfluttar og aðgengilegar
- [ ] Engar TypeScript villur

### Útfærsluskref

1. Opna `src/types/calculator.ts`
2. Bæta við `FIInputs` interface fyrir inntök FI útreikninga:
   ```typescript
   export interface FIInputs {
     fiNumber: number;              // Markmið (ISK)
     annualIncome: number;          // Árstekjur (ISK)
     annualExpenses: number;        // Árleg útgjöld (ISK)
     currentNetWorth: number;       // Núverandi eign (ISK)
     expectedReturnRate: number;    // Vænt ávöxtun (%)
     fiMultiplier: number;          // FI margföldun (25x, 30x)
     currentSavingsRate?: number;   // Núverandi sparnaðarhlutfall (%)
   }
   ```
3. Bæta við `FIResults` interface fyrir niðurstöður:
   ```typescript
   export interface FIResults {
     yearsToFI: number;
     fiDate: Date;
     monthsToFI: number;
     impactPer1Percent: { months: number; years: number; workHours: number };
     impactPer5Percent: { months: number; years: number; workHours: number };
     impactPer10Percent: { months: number; years: number; workHours: number };
     totalWorkHoursToFI: number;
     totalWorkDaysToFI: number;
     totalWorkYearsToFI: number;
     currentProgress: number;
     monthlyInvestment: number;
     annualInvestment: number;
     changeFromBaseline?: {
       months: number;
       years: number;
       percentage: number;
     };
   }
   ```
4. Bæta við `FIScenario` interface fyrir atburðarásir:
   ```typescript
   export interface FIScenario {
     id: string;
     name: string;
     inputs: FIInputs;
     results: FIResults;
     savingsRate: number;
     isBaseline: boolean;
     createdAt: string;
     updatedAt: string;
   }
   ```
5. Bæta við `FISnapshot` interface fyrir framvindu:
   ```typescript
   export interface FISnapshot {
     id: string;
     timestamp: string;
     savingsRate: number;
     fiDate: Date;
     yearsToFI: number;
     currentNetWorth: number;
     notes?: string;
   }
   ```
6. Bæta við `FICurveDataPoint` fyrir feril:
   ```typescript
   export interface FICurveDataPoint {
     savingsRate: number;
     yearsToFI: number;
     monthsToFI: number;
     isCurrent: boolean;
     isReference: boolean;
   }
   ```
7. Bæta við `WhatIfScenario` fyrir "hvað ef" athuganir:
   ```typescript
   export interface WhatIfScenario {
     type: 'expense-reduction' | 'income-increase' | 'quit-work' | 'custom';
     label: string;
     adjustment: {
       incomeChange?: number;
       expenseChange?: number;
       savingsRateChange?: number;
     };
     result: FIResults;
     isActive: boolean;
   }
   ```
8. Uppfæra `CalculatorState` til að innihalda FI stöðu:
   ```typescript
   export interface CalculatorState {
     // ... fyrirliggjandi reitir
     fiInputs: FIInputs;
     fiResults: FIResults | null;
     scenarios: FIScenario[];
     baselineScenarioId: string | null;
     snapshots: FISnapshot[];
     whatIfScenario: WhatIfScenario | null;
   }
   ```
9. Keyra TypeScript sannprófun: `npm run type-check`

### Skrár búnar til
- `src/types/calculator.ts` - FI týpur bætt við (viðbætur við fyrirliggjandi skrá)

### Athugasemdir
- Allar týpur eru útfluttar (exported) fyrir endurnýtingu
- FIInputs styður bæði handvirkt FI markmið og útreiknað (expenses × multiplier)
- FIResults inniheldur bæði fjárhagslegar og lífsorku mælikvarða
- Scenarios styður að hámarki 4 atburðarásir (MAX_SCENARIOS = 4)
- Snapshots fyrir framvindu rakningu eru valfrjáls

---

## Verkefni 2: Búa til FI fastar og sjálfgefin gildi

**Staða**: [ ] Ekki byrjað
**Flækjustig**: Einfalt
**Háðir**: Verkefni 1
**Tími**: 1 klst

### Lýsing
Skilgreina fastar, sjálfgefin gildi og íslenskar strengi fyrir FI reiknivélina.

### Samþykktarviðmið
- [ ] FI_CONSTANTS skilgreind með öllum föstum
- [ ] DEFAULT_FI_INPUTS með réttum sjálfgefnum gildum
- [ ] ICELANDIC_MONTHS fylki fyrir mánaðarnöfn
- [ ] FI_STRINGS með öllum UI textum á íslensku
- [ ] QUICK_WHAT_IF_PRESETS fyrir fljótlegar athuganir

### Útfærsluskref

1. Búa til `src/lib/constants/fi.ts`
2. Skilgreina FI_CONSTANTS:
   ```typescript
   export const FI_CONSTANTS = {
     MIN_RETURN_RATE: 0,
     MAX_RETURN_RATE: 15,
     DEFAULT_RETURN_RATE: 7,
     MIN_FI_MULTIPLIER: 20,
     MAX_FI_MULTIPLIER: 40,
     DEFAULT_FI_MULTIPLIER: 25,
     MIN_SAVINGS_RATE: 0,
     MAX_SAVINGS_RATE: 100,
     MAX_SCENARIOS: 4,
     MAX_SNAPSHOTS: 100,
     WORK_HOURS_PER_DAY: 8,
     WORK_DAYS_PER_YEAR: 250,
     WORK_HOURS_PER_YEAR: 2000,
   };
   ```
3. Skilgreina DEFAULT_FI_INPUTS:
   ```typescript
   export const DEFAULT_FI_INPUTS: FIInputs = {
     fiNumber: 0,
     annualIncome: 0,
     annualExpenses: 0,
     currentNetWorth: 0,
     expectedReturnRate: 7,
     fiMultiplier: 25,
     currentSavingsRate: 0,
   };
   ```
4. Skilgreina ICELANDIC_MONTHS:
   ```typescript
   export const ICELANDIC_MONTHS = [
     'janúar', 'febrúar', 'mars', 'apríl', 'maí', 'júní',
     'júlí', 'ágúst', 'september', 'október', 'nóvember', 'desember'
   ];
   ```
5. Skilgreina FI_STRINGS fyrir UI texta:
   ```typescript
   export const FI_STRINGS = {
     title: 'Sparnaðarhlutfall Reiknivél',
     subtitle: 'Sjáðu hvernig sparnaður hefur áhrif á fjármálafrelsi',
     inputs: {
       fiNumber: 'FI Markmið',
       annualIncome: 'Árstekjur',
       annualExpenses: 'Árleg útgjöld',
       currentNetWorth: 'Núverandi eign',
       expectedReturn: 'Vænt ávöxtun',
       fiMultiplier: 'FI Margföldun',
     },
     results: {
       fiDate: 'Fjármálafrelsi',
       yearsToFI: 'Ár til fjármálafrelsis',
       impactPer1: 'Hver 1% sparar þér',
       lifeEnergy: 'Vinnuár eftir',
     },
     scenarios: {
       add: 'Bæta við atburðarás',
       baseline: 'Grunnlína',
       optimal: 'Besta',
       compare: 'Samanburður',
     },
     messages: {
       achieved: 'Þú hefur náð fjármálafrelsi!',
       negative: 'Útgjöld eru hærri en tekjur',
       farAway: 'Markmiðið er mjög langt í burtu',
     },
   };
   ```
6. Skilgreina QUICK_WHAT_IF_PRESETS:
   ```typescript
   export const QUICK_WHAT_IF_PRESETS = [
     {
       type: 'expense-reduction',
       label: 'Hvað ef ég lækka útgjöld um 10%?',
       adjustment: { expenseChange: -10 },
     },
     {
       type: 'expense-reduction',
       label: 'Hvað ef ég lækka útgjöld um 20%?',
       adjustment: { expenseChange: -20 },
     },
     {
       type: 'income-increase',
       label: 'Hvað ef ég auka tekjur um 20%?',
       adjustment: { incomeChange: 20 },
     },
     {
       type: 'custom',
       label: 'Hvað ef ég hætti núna?',
       adjustment: { savingsRateChange: 0 },
     },
   ];
   ```
7. Útflytja allar fastar
8. Keyra TypeScript sannprófun

### Skrár búnar til
- `src/lib/constants/fi.ts` (ný skrá, ~100 línur)

### Athugasemdir
- Allar fastar á einum stað fyrir auðvelda uppfærslu
- Íslenskar strengir fyrir allt UI
- DEFAULT_RETURN_RATE = 7% er venjulegur staðall fyrir FIRE útreikninga
- FI_MULTIPLIER = 25x samsvarar 4% úttektarreglu (4% withdrawal rule)

---

## Verkefni 3: Útfæra FI útreikningavél (calculation functions)

**Staða**: [ ] Ekki byrjað
**Flækjustig**: Miðlungs
**Háðir**: Verkefni 1, Verkefni 2
**Tími**: 3-4 klst

### Lýsing
Útfæra hrein útreikningsföll (pure functions) fyrir FI útreikninga án hliðarverkana.

### Samþykktarviðmið
- [ ] `calculateYearsToFI()` notar rétta stærðfræðiformúlu
- [ ] `calculateFIDate()` reiknar dagsetningu rétt
- [ ] `calculateSavingsRate()` reiknar sparnaðarhlutfall
- [ ] `calculateMarginalImpact()` reiknar áhrif 1%, 5%, 10% breytinga
- [ ] `calculateFIResults()` skilar öllum niðurstöðum
- [ ] `generateFICurveData()` býr til gögn fyrir feril
- [ ] Öll föll meðhöndla jaðartilvik (edge cases) rétt
- [ ] Öll föll eru hrein (no side effects)
- [ ] Öll föll eru prófuð með einingaprófum

### Útfærsluskref

1. Búa til `src/lib/calculations/fi.ts`
2. Útfæra `calculateYearsToFI()`:
   ```typescript
   export function calculateYearsToFI(
     fiNumber: number,
     annualSavings: number,
     currentNetWorth: number,
     returnRate: number
   ): number {
     // Jaðartilvik: nú þegar náð FI
     if (currentNetWorth >= fiNumber) return 0;

     // Jaðartilvik: neikvæður sparnaður
     if (annualSavings <= 0) return Infinity;

     const r = returnRate / 100;
     const gap = fiNumber - currentNetWorth;

     if (r === 0) {
       // Engin ávöxtun, einföld deiling
       return gap / annualSavings;
     }

     // Formúla: ln((FI × r / Savings) + 1) / ln(1 + r)
     const numerator = Math.log((fiNumber * r / annualSavings) + 1);
     const denominator = Math.log(1 + r);
     const years = numerator / denominator;

     // Sannprófun
     if (!isFinite(years) || years < 0 || years > 100) {
       return Infinity;
     }

     return years;
   }
   ```
3. Útfæra `calculateFIDate()`:
   ```typescript
   export function calculateFIDate(yearsToFI: number): Date {
     if (!isFinite(yearsToFI)) {
       return new Date(2100, 0, 1);
     }

     const now = new Date();
     const millisToAdd = yearsToFI * 365.25 * 24 * 60 * 60 * 1000;
     return new Date(now.getTime() + millisToAdd);
   }
   ```
4. Útfæra `calculateSavingsRate()`:
   ```typescript
   export function calculateSavingsRate(
     annualIncome: number,
     annualExpenses: number
   ): number {
     if (annualIncome <= 0) return 0;

     const savingsRate = ((annualIncome - annualExpenses) / annualIncome) * 100;
     return Math.max(0, Math.min(100, savingsRate));
   }
   ```
5. Útfæra `calculateAnnualSavings()`:
   ```typescript
   export function calculateAnnualSavings(
     annualIncome: number,
     savingsRate: number
   ): number {
     return annualIncome * (savingsRate / 100);
   }
   ```
6. Útfæra `calculateFINumber()`:
   ```typescript
   export function calculateFINumber(
     annualExpenses: number,
     fiMultiplier: number
   ): number {
     return annualExpenses * fiMultiplier;
   }
   ```
7. Útfæra `calculateMarginalImpact()`:
   ```typescript
   export function calculateMarginalImpact(
     inputs: FIInputs,
     currentYearsToFI: number,
     savingsRateChange: number,
     actualHourlyWage?: number
   ): { months: number; years: number; workHours: number } {
     const newSavingsRate = (inputs.currentSavingsRate || 0) + savingsRateChange;
     const newAnnualSavings = calculateAnnualSavings(inputs.annualIncome, newSavingsRate);

     const newYearsToFI = calculateYearsToFI(
       inputs.fiNumber,
       newAnnualSavings,
       inputs.currentNetWorth,
       inputs.expectedReturnRate
     );

     const yearsDifference = currentYearsToFI - newYearsToFI;
     const monthsDifference = yearsDifference * 12;

     let workHours = 0;
     if (actualHourlyWage && actualHourlyWage > 0) {
       workHours = yearsDifference * FI_CONSTANTS.WORK_HOURS_PER_YEAR;
     }

     return { months: monthsDifference, years: yearsDifference, workHours };
   }
   ```
8. Útfæra `calculateFIResults()`:
   ```typescript
   export function calculateFIResults(
     inputs: FIInputs,
     actualHourlyWage?: number,
     baselineResults?: FIResults
   ): FIResults {
     const savingsRate = inputs.currentSavingsRate ||
       calculateSavingsRate(inputs.annualIncome, inputs.annualExpenses);

     const annualSavings = calculateAnnualSavings(inputs.annualIncome, savingsRate);
     const monthlyInvestment = annualSavings / 12;

     const yearsToFI = calculateYearsToFI(
       inputs.fiNumber,
       annualSavings,
       inputs.currentNetWorth,
       inputs.expectedReturnRate
     );

     const monthsToFI = yearsToFI * 12;
     const fiDate = calculateFIDate(yearsToFI);

     const impactPer1Percent = calculateMarginalImpact(inputs, yearsToFI, 1, actualHourlyWage);
     const impactPer5Percent = calculateMarginalImpact(inputs, yearsToFI, 5, actualHourlyWage);
     const impactPer10Percent = calculateMarginalImpact(inputs, yearsToFI, 10, actualHourlyWage);

     const totalWorkHoursToFI = yearsToFI * FI_CONSTANTS.WORK_HOURS_PER_YEAR;
     const totalWorkDaysToFI = totalWorkHoursToFI / FI_CONSTANTS.WORK_HOURS_PER_DAY;
     const totalWorkYearsToFI = totalWorkHoursToFI / FI_CONSTANTS.WORK_HOURS_PER_YEAR;

     const currentProgress = inputs.fiNumber > 0
       ? (inputs.currentNetWorth / inputs.fiNumber) * 100
       : 0;

     let changeFromBaseline;
     if (baselineResults) {
       const monthsDiff = baselineResults.monthsToFI - monthsToFI;
       const yearsDiff = monthsDiff / 12;
       const percentageDiff = baselineResults.yearsToFI > 0
         ? (yearsDiff / baselineResults.yearsToFI) * 100
         : 0;

       changeFromBaseline = {
         months: monthsDiff,
         years: yearsDiff,
         percentage: percentageDiff,
       };
     }

     return {
       yearsToFI,
       fiDate,
       monthsToFI,
       impactPer1Percent,
       impactPer5Percent,
       impactPer10Percent,
       totalWorkHoursToFI,
       totalWorkDaysToFI,
       totalWorkYearsToFI,
       currentProgress,
       monthlyInvestment,
       annualInvestment: annualSavings,
       changeFromBaseline,
     };
   }
   ```
9. Útfæra `generateFICurveData()`:
   ```typescript
   export function generateFICurveData(
     inputs: FIInputs,
     currentSavingsRate: number,
     step: number = 5
   ): FICurveDataPoint[] {
     const dataPoints: FICurveDataPoint[] = [];

     for (let rate = 0; rate <= 100; rate += step) {
       const annualSavings = calculateAnnualSavings(inputs.annualIncome, rate);
       const yearsToFI = calculateYearsToFI(
         inputs.fiNumber,
         annualSavings,
         inputs.currentNetWorth,
         inputs.expectedReturnRate
       );

       const displayYears = Math.min(yearsToFI, 40);

       dataPoints.push({
         savingsRate: rate,
         yearsToFI: isFinite(displayYears) ? displayYears : 40,
         monthsToFI: displayYears * 12,
         isCurrent: Math.abs(rate - currentSavingsRate) < step / 2,
         isReference: rate === 25 || rate === 50 || rate === 75,
       });
     }

     return dataPoints;
   }
   ```
10. Skrifa einingapróf fyrir öll föll (tests/lib/calculations/fi.test.ts)
11. Keyra próf: `npm run test`

### Skrár búnar til
- `src/lib/calculations/fi.ts` (~250 línur)
- `tests/lib/calculations/fi.test.ts` (~200 línur)

### Athugasemdir
- Allar útreikningsfall eru hrein (pure functions) fyrir auðvelt próf
- Jaðartilvik meðhöndluð: 0% sparnaður, náð FI, >100 ár, stærðfræðivillur
- Formúla fyrir years to FI notar logarithma fyrir nákvæma samsettu vexti
- generateFICurveData býr til gagnapunkta á 5% bili fyrir ferilrit

---

## Verkefni 4: Búa til hjálparföll fyrir íslensku snið

**Staða**: [ ] Ekki byrjað
**Flækjustig**: Einfalt
**Háðir**: Verkefni 2
**Tími**: 1-2 klst

### Lýsing
Búa til hjálparföll fyrir íslensku dagsetningar-, númer- og textasnið.

### Samþykktarviðmið
- [ ] `formatIcelandicDate()` sníður dagsetningar á íslensku
- [ ] `formatRelativeTime()` sníður afstæðan tíma (X ár, Y mánuðir)
- [ ] `formatISK()` sníður upphæðir með íslenskri táknun
- [ ] `formatWorkTime()` sníður vinnustundir/daga/ár
- [ ] Öll föll próf með edge cases

### Útfærsluskref

1. Búa til `src/lib/utils/dateFormatters.ts`
2. Útfæra `formatIcelandicDate()`:
   ```typescript
   import { ICELANDIC_MONTHS } from '../constants/fi';

   export function formatIcelandicDate(date: Date): string {
     const month = ICELANDIC_MONTHS[date.getMonth()];
     const year = date.getFullYear();
     return `${month} ${year}`;
   }
   ```
3. Útfæra `formatRelativeTime()`:
   ```typescript
   export function formatRelativeTime(years: number): string {
     const wholeYears = Math.floor(years);
     const months = Math.round((years - wholeYears) * 12);

     const yearPart = wholeYears > 0
       ? `${wholeYears} ár`
       : '';

     const monthPart = months > 0
       ? `${months} ${months === 1 ? 'mánuður' : 'mánuðir'}`
       : '';

     return [yearPart, monthPart].filter(Boolean).join(' og ');
   }
   ```
4. Útfæra `formatISK()`:
   ```typescript
   export function formatISK(amount: number): string {
     return new Intl.NumberFormat('is-IS', {
       style: 'decimal',
       minimumFractionDigits: 0,
       maximumFractionDigits: 0,
     }).format(amount) + ' kr';
   }
   ```
5. Útfæra `formatWorkTime()`:
   ```typescript
   import { FI_CONSTANTS } from '../constants/fi';

   export function formatWorkTime(
     hours: number,
     format: 'hours' | 'days' | 'years' = 'auto'
   ): string {
     if (format === 'hours' || (format === 'auto' && hours < 1000)) {
       return `${Math.round(hours)} vinnustundir`;
     }

     if (format === 'days' || (format === 'auto' && hours < 10000)) {
       const days = Math.round(hours / FI_CONSTANTS.WORK_HOURS_PER_DAY);
       return `${days} ${days === 1 ? 'vinnudagur' : 'vinnudagar'}`;
     }

     const years = (hours / FI_CONSTANTS.WORK_HOURS_PER_YEAR).toFixed(1);
     return `${years} vinnuár`;
   }
   ```
6. Skrifa einingapróf fyrir öll föll
7. Keyra próf

### Skrár búnar til
- `src/lib/utils/dateFormatters.ts` (~80 línur)
- `tests/lib/utils/dateFormatters.test.ts` (~100 línur)

### Athugasemdir
- Notar íslenskar mánaðarnafn úr ICELANDIC_MONTHS
- Intl.NumberFormat með 'is-IS' locale fyrir íslenskt númersnið
- formatWorkTime velur sjálfkrafa besta sniðið eftir fjölda klukkustunda
- Allar aðgerðir eru hreinar fyrir auðvelt próf

---

## Verkefni 5: Uppfæra CalculatorContext fyrir FI

**Staða**: [ ] Ekki byrjað
**Flækjustig**: Miðlungs
**Háðir**: Verkefni 1-4
**Tími**: 3-4 klst

### Lýsing
Uppfæra CalculatorContext til að styðja FI útreikninga, atburðarásir og framvindu.

### Samþykktarviðmið
- [ ] Context veitir fiInputs state og setters
- [ ] Context veitir fiResults með useMemo
- [ ] Context veitir scenarios CRUD aðgerðir
- [ ] Context veitir snapshots CRUD aðgerðir
- [ ] Context veitir whatIfScenario meðhöndlun
- [ ] Context veitir fiCurveData með useMemo
- [ ] localStorage integration virkar fyrir FI gögn
- [ ] exportData inniheldur FI gögn
- [ ] importData flytur inn FI gögn
- [ ] resetAll núllstillir FI gögn

### Útfærsluskref

1. Opna `src/context/CalculatorContext.tsx`
2. Uppfæra `CalculatorContextType` interface:
   ```typescript
   interface CalculatorContextType {
     // ... fyrirliggjandi reitir

     // FI state
     fiInputs: FIInputs;
     setFIInputs: (inputs: FIInputs) => void;
     updateFIInputs: (partial: Partial<FIInputs>) => void;
     fiResults: FIResults | null;

     // Scenarios
     scenarios: FIScenario[];
     baselineScenarioId: string | null;
     addScenario: (name: string) => void;
     updateScenario: (id: string, updates: Partial<FIScenario>) => void;
     deleteScenario: (id: string) => void;
     loadScenario: (id: string) => void;
     setBaseline: (id: string) => void;

     // Snapshots
     snapshots: FISnapshot[];
     addSnapshot: (notes?: string) => void;
     deleteSnapshot: (id: string) => void;
     clearSnapshots: () => void;

     // What-if
     whatIfScenario: WhatIfScenario | null;
     applyWhatIf: (scenario: WhatIfScenario) => void;
     acceptWhatIf: () => void;
     cancelWhatIf: () => void;

     // Derived
     fiCurveData: FICurveDataPoint[];
     progressTrend: 'improving' | 'stable' | 'declining' | 'insufficient-data';
   }
   ```
3. Bæta við FI state í CalculatorProvider:
   ```typescript
   const [fiInputs, setFIInputs] = useState<FIInputs>(DEFAULT_FI_INPUTS);
   const [scenarios, setScenarios] = useState<FIScenario[]>([]);
   const [baselineScenarioId, setBaselineScenarioId] = useState<string | null>(null);
   const [snapshots, setSnapshots] = useState<FISnapshot[]>([]);
   const [whatIfScenario, setWhatIfScenario] = useState<WhatIfScenario | null>(null);
   ```
4. Útfæra `fiResults` með useMemo:
   ```typescript
   const fiResults = useMemo(() => {
     if (!fiInputs.fiNumber || !fiInputs.annualIncome || !fiInputs.annualExpenses) {
       return null;
     }

     const baselineResults = baselineScenarioId
       ? scenarios.find(s => s.id === baselineScenarioId)?.results
       : undefined;

     return calculateFIResults(fiInputs, actualHourlyWage, baselineResults);
   }, [fiInputs, actualHourlyWage, baselineScenarioId, scenarios]);
   ```
5. Útfæra `updateFIInputs`:
   ```typescript
   const updateFIInputs = useCallback((partial: Partial<FIInputs>) => {
     setFIInputs(prev => ({ ...prev, ...partial }));
   }, []);
   ```
6. Útfæra scenario aðgerðir:
   ```typescript
   const addScenario = useCallback((name: string) => {
     if (!fiResults) return;
     if (scenarios.length >= FI_CONSTANTS.MAX_SCENARIOS) {
       alert(`Hámark ${FI_CONSTANTS.MAX_SCENARIOS} atburðarásir`);
       return;
     }

     const isFirstScenario = scenarios.length === 0;
     const newScenario = createScenario(name, fiInputs, fiResults, isFirstScenario);

     setScenarios(prev => [...prev, newScenario]);

     if (isFirstScenario) {
       setBaselineScenarioId(newScenario.id);
     }
   }, [fiInputs, fiResults, scenarios]);

   const deleteScenario = useCallback((id: string) => {
     setScenarios(prev => prev.filter(s => s.id !== id));
     if (baselineScenarioId === id) {
       setBaselineScenarioId(scenarios[0]?.id || null);
     }
   }, [baselineScenarioId, scenarios]);

   const loadScenario = useCallback((id: string) => {
     const scenario = scenarios.find(s => s.id === id);
     if (scenario) {
       setFIInputs(scenario.inputs);
     }
   }, [scenarios]);

   const setBaseline = useCallback((id: string) => {
     setBaselineScenarioId(id);
   }, []);
   ```
7. Útfæra snapshot aðgerðir:
   ```typescript
   const addSnapshot = useCallback((notes?: string) => {
     if (!fiResults) return;

     const newSnapshot = createSnapshot(
       fiInputs.currentSavingsRate || 0,
       fiResults.fiDate,
       fiResults.yearsToFI,
       fiInputs.currentNetWorth,
       notes
     );

     setSnapshots(prev => {
       const updated = [...prev, newSnapshot];
       // Keep only MAX_SNAPSHOTS most recent
       if (updated.length > FI_CONSTANTS.MAX_SNAPSHOTS) {
         updated.shift();
       }
       return updated;
     });
   }, [fiInputs, fiResults]);

   const deleteSnapshot = useCallback((id: string) => {
     setSnapshots(prev => prev.filter(s => s.id !== id));
   }, []);

   const clearSnapshots = useCallback(() => {
     setSnapshots([]);
   }, []);
   ```
8. Útfæra what-if aðgerðir:
   ```typescript
   const applyWhatIf = useCallback((scenario: WhatIfScenario) => {
     setWhatIfScenario(scenario);
   }, []);

   const acceptWhatIf = useCallback(() => {
     if (!whatIfScenario) return;

     // Apply adjustments to fiInputs
     const { adjustment } = whatIfScenario;

     const newInputs = { ...fiInputs };

     if (adjustment.incomeChange !== undefined) {
       newInputs.annualIncome *= (1 + adjustment.incomeChange / 100);
     }

     if (adjustment.expenseChange !== undefined) {
       newInputs.annualExpenses *= (1 + adjustment.expenseChange / 100);
     }

     if (adjustment.savingsRateChange !== undefined) {
       newInputs.currentSavingsRate = adjustment.savingsRateChange;
     }

     setFIInputs(newInputs);
     setWhatIfScenario(null);
   }, [whatIfScenario, fiInputs]);

   const cancelWhatIf = useCallback(() => {
     setWhatIfScenario(null);
   }, []);
   ```
9. Útfæra `fiCurveData` með useMemo:
   ```typescript
   const fiCurveData = useMemo(() => {
     if (!fiInputs.fiNumber) return [];

     const currentSavingsRate = fiInputs.currentSavingsRate ||
       calculateSavingsRate(fiInputs.annualIncome, fiInputs.annualExpenses);

     return generateFICurveData(fiInputs, currentSavingsRate);
   }, [fiInputs]);
   ```
10. Útfæra `progressTrend` með useMemo:
    ```typescript
    const progressTrend = useMemo(() => {
      return calculateProgressTrend(snapshots);
    }, [snapshots]);
    ```
11. Uppfæra localStorage save/load til að innihalda FI gögn
12. Uppfæra exportData til að innihalda FI gögn
13. Uppfæra importData til að flytja inn FI gögn
14. Uppfæra resetAll til að núllstilla FI gögn

### Skrár til að breyta
- `src/context/CalculatorContext.tsx` (uppfæra)

### Athugasemdir
- fiResults endurreiknast sjálfkrafa þegar fiInputs breytist
- fiCurveData endurreiknast aðeins þegar nauðsynlegt (useMemo)
- Scenarios styður að hámarki 4 atburðarásir
- Snapshots styður að hámarki 100 skyndimyndir (elstu fjarlægðar sjálfkrafa)
- What-if scenarios eru tímabundin og þarf að samþykkja/hafna

---

## Verkefni 6: Búa til FI inntakshóp (FIInputsSection)

**Staða**: [ ] Ekki byrjað
**Flækjustig**: Miðlungs
**Háðir**: Verkefni 5
**Tími**: 3-4 klst

### Lýsing
Búa til React íhlut fyrir FI inntök (markmið, tekjur, útgjöld, eign, ávöxtun).

### Samþykktarviðmið
- [ ] Íhluti sýnir öll nauðsynleg FI inntaksreitir
- [ ] Styður bæði handvirkt FI markmið og útreiknað (útgjöld × margföldun)
- [ ] Sannprófar öll inntök
- [ ] Sýnir villuboð fyrir ógild gildi
- [ ] Uppfærir CalculatorContext við breytingar
- [ ] Styður ítarlegri reitir í samfellanlegum hluta
- [ ] Aðgengilegt (labels, ARIA)
- [ ] Móttækilegt fyrir farsíma

### Útfærsluskref

1. Búa til `src/components/fi-calculator/FIInputsSection.tsx`
2. Skilgreina viðmót (interface):
   ```typescript
   interface FIInputsSectionProps {
     inputs: FIInputs;
     onChange: (updates: Partial<FIInputs>) => void;
     showAdvanced?: boolean;
     compactMode?: boolean;
   }
   ```
3. Útfæra íhlut með stöðu fyrir sannprófun:
   ```typescript
   export function FIInputsSection({
     inputs,
     onChange,
     showAdvanced = false,
     compactMode = false
   }: FIInputsSectionProps) {
     const [validation, setValidation] = useState(validateFIInputs(inputs));
     const [isAdvancedOpen, setIsAdvancedOpen] = useState(showAdvanced);

     // ... implementation
   }
   ```
4. Útfæra FI markmið inntaksreit með valkosti:
   - Val 1: Handvirkt inntaksgildi
   - Val 2: Útreiknað frá útgjöldum × margföldun
5. Útfæra árstekjur reit (ISK snið)
6. Útfæra árleg útgjöld reit (ISK snið)
7. Útfæra ítarlegir reitir (collapsible):
   - Núverandi eign (optional)
   - Vænt ávöxtun (slider, 0-15%, default 7%)
   - FI margföldun (slider, 20-40x, default 25x)
8. Útfæra sannprófun á inntökum
9. Útfæra viðvörunarboð (warnings):
   - Útgjöld ≥ tekjur: "0% sparnaður"
   - Núverandi eign ≥ FI markmið: "Þú hefur náð FI!"
   - Ávöxtun > 12%: "Mjög bjartsýn ávöxtun"
10. Stíla með Tailwind CSS
11. Prófa á mismunandi skjástærðum

### Skrár búnar til
- `src/components/fi-calculator/FIInputsSection.tsx` (~200 línur)

### Athugasemdir
- Notar validateFIInputs fyrir inntaksannprófun
- Notar formatISK fyrir ISK snið
- Ítarlegir reitir eru samfellanlegir fyrir einfaldara viðmót
- Viðvaranir sýndar með gulu litamerki (ekki villur)
- Allir reitir með íslenskar labels og placeholder

---

## Verkefni 7: Búa til Sparnaðarhlutfall Rennislá (SavingsRateSlider)

**Staða**: [ ] Ekki byrjað
**Flækjustig**: Miðlungs
**Háðir**: Verkefni 5
**Tími**: 3-4 klst

### Lýsing
Búa til aðalrennislá íhlut fyrir sparnaðarhlutfall með fljótlegum breytingahnöppum.

### Samþykktarviðmið
- [ ] Rennislá virkar með snertingu og mús
- [ ] Gildi uppfærist í rauntíma (100ms debounce)
- [ ] Sýnir núverandi sparnaðarhlutfall merki
- [ ] Sýnir markmið sparnaðarhlutfall (ef sett)
- [ ] Fljótlegir breytingahnappar (+5%, +10%, +15%)
- [ ] Töluleg inntök sem valkostur við rennislá
- [ ] Aðgengilegt (ARIA, lyklaborð)
- [ ] Snertivæn hönnun (≥44px snertiflétta)
- [ ] Móttækilegt fyrir farsíma

### Útfærsluskref

1. Búa til `src/components/fi-calculator/SavingsRateSlider.tsx`
2. Skilgreina viðmót:
   ```typescript
   interface SavingsRateSliderProps {
     value: number;                    // 0-100
     onChange: (value: number) => void;
     currentRate: number;              // Núverandi/sjálfgefið
     targetRate?: number;              // Markmið (optional)
     disabled?: boolean;
     showQuickAdjust?: boolean;
   }
   ```
3. Útfæra rennislá með debounce:
   ```typescript
   const debouncedOnChange = useMemo(
     () => debounce(onChange, 100),
     [onChange]
   );

   const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const newValue = parseInt(e.target.value, 10);
     setLocalValue(newValue);
     debouncedOnChange(newValue);
   };
   ```
4. Útfæra núverandi hlutfall merki (línan á rennislá):
   ```typescript
   <div
     className="absolute h-10 w-1 bg-primary-700"
     style={{ left: `${currentRate}%` }}
     aria-label={`Núverandi: ${currentRate}%`}
   />
   ```
5. Útfæra markmið hlutfall merki (ef sett):
   ```typescript
   {targetRate && (
     <div
       className="absolute h-10 w-1 bg-fi-target"
       style={{ left: `${targetRate}%` }}
       aria-label={`Markmið: ${targetRate}%`}
     />
   )}
   ```
6. Útfæra fljótlega breytingahnappar:
   ```typescript
   <div className="flex gap-2 justify-center mt-4">
     <button onClick={() => onChange(Math.min(100, value + 5))}>
       +5%
     </button>
     <button onClick={() => onChange(Math.min(100, value + 10))}>
       +10%
     </button>
     <button onClick={() => onChange(Math.min(100, value + 15))}>
       +15%
     </button>
   </div>
   ```
7. Útfæra töluleg inntök sem valkost:
   ```typescript
   <input
     type="number"
     min={0}
     max={100}
     value={value}
     onChange={(e) => onChange(parseInt(e.target.value, 10))}
     className="w-20 text-center"
     aria-label="Sparnaðarhlutfall prósenta"
   />
   ```
8. Bæta við ARIA eiginleikum:
   ```typescript
   <input
     type="range"
     role="slider"
     aria-label="Sparnaðarhlutfall"
     aria-valuemin={0}
     aria-valuemax={100}
     aria-valuenow={value}
     aria-valuetext={`${value} prósent`}
     // ...
   />
   ```
9. Stíla með Tailwind CSS:
   - Rennislá: h-3 track, h-8 w-8 thumb
   - Snertivænir hnappar: min-h-[44px]
   - Móttækilegt: stack vertically á mobile
10. Prófa snertingu, mús og lyklaborð

### Skrár búnar til
- `src/components/fi-calculator/SavingsRateSlider.tsx` (~150 línur)

### Athugasemdir
- Notar debounce til að forðast of margar uppfærslur
- Núverandi og markmið merkingar hjálpa notendum sjá hvar þeir eru
- Fljótlegir hnappar fyrir algengar breytingar (+5%, +10%, +15%)
- Árið eiginleiki fyrir bæði rennislá og töluleg inntök

---

## Verkefni 8: Búa til FI Niðurstöður Sýning (FIResultsDisplay)

**Staða**: [ ] Ekki byrjað
**Flækjustig**: Miðlungs
**Háðir**: Verkefni 4, Verkefni 5
**Tími**: 3-4 klst

### Lýsing
Búa til íhlut til að sýna FI niðurstöður (FI dagsetning, áhrif, lífsorka).

### Samþykktarviðmið
- [ ] Sýnir FI dagsetningu á íslensku
- [ ] Sýnir afstæðan tíma (X ár, Y mánuðir)
- [ ] Sýnir breytingu frá grunnlínu (ef til)
- [ ] Sýnir lífsorku mælingar (vinnustundir/dagar/ár)
- [ ] Litakóðað: grænt = betra, rautt = verra
- [ ] Hreyfimynd við gildi breytingar
- [ ] Meðhöndlar null niðurstöður (loading/error state)
- [ ] Móttækilegt fyrir farsíma

### Útfærsluskref

1. Búa til `src/components/fi-calculator/FIResultsDisplay.tsx`
2. Skilgreina viðmót:
   ```typescript
   interface FIResultsDisplayProps {
     results: FIResults | null;
     showLifeEnergy?: boolean;
     showMarginalImpact?: boolean;
     compactMode?: boolean;
   }
   ```
3. Útfæra FI dagsetningar sýning:
   ```typescript
   {results && (
     <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-8">
       <h2 className="text-sm text-primary-600 uppercase">
         {FI_STRINGS.results.fiDate}
       </h2>
       <div className="text-5xl font-bold text-primary-700 mt-2">
         {formatIcelandicDate(results.fiDate)}
       </div>
       <div className="text-2xl text-primary-600 mt-2">
         ({formatRelativeTime(results.yearsToFI)})
       </div>
     </div>
   )}
   ```
4. Útfæra breytingu frá grunnlínu:
   ```typescript
   {results?.changeFromBaseline && (
     <div className={cn(
       "mt-4 text-lg font-semibold",
       results.changeFromBaseline.months > 0
         ? "text-fi-success"
         : results.changeFromBaseline.months < 0
         ? "text-fi-danger"
         : "text-neutral-600"
     )}>
       {results.changeFromBaseline.months > 0 ? '↓' : '↑'}
       {' '}
       {formatRelativeTime(Math.abs(results.changeFromBaseline.years))}
       {' '}
       {results.changeFromBaseline.months > 0 ? 'fyrr' : 'seinna'}
     </div>
   )}
   ```
5. Útfæra lífsorku sýning:
   ```typescript
   {showLifeEnergy && results && (
     <div className="mt-6 p-4 bg-white rounded-lg border">
       <h3 className="font-semibold mb-2">
         {FI_STRINGS.results.lifeEnergy}
       </h3>
       <div className="text-2xl text-primary-700">
         {formatWorkTime(results.totalWorkHoursToFI)}
       </div>
       <div className="text-sm text-neutral-600 mt-1">
         ({Math.round(results.totalWorkHoursToFI).toLocaleString('is-IS')} vinnustundir)
       </div>
     </div>
   )}
   ```
6. Útfæra jaðaráhrif sýning (marginal impact):
   ```typescript
   {showMarginalImpact && results && (
     <div className="mt-6 space-y-2">
       <h3 className="font-semibold">
         {FI_STRINGS.results.impactPer1}:
       </h3>
       <div className="text-lg">
         • 1%: {formatRelativeTime(results.impactPer1Percent.years)}
       </div>
       <div className="text-lg">
         • 5%: {formatRelativeTime(results.impactPer5Percent.years)}
       </div>
       <div className="text-lg">
         • 10%: {formatRelativeTime(results.impactPer10Percent.years)}
       </div>
     </div>
   )}
   ```
7. Útfæra loading/error states:
   ```typescript
   if (!results) {
     return (
       <div className="bg-neutral-50 rounded-xl p-8 text-center">
         <p className="text-neutral-600">
           Fylltu út FI inntök til að sjá niðurstöður
         </p>
       </div>
     );
   }
   ```
8. Bæta við hreyfimynd með framer-motion (optional):
   ```typescript
   import { motion } from 'framer-motion';

   <motion.div
     initial={{ scale: 0.95, opacity: 0 }}
     animate={{ scale: 1, opacity: 1 }}
     transition={{ duration: 0.3 }}
   >
     {/* results content */}
   </motion.div>
   ```
9. Stíla fyrir mobile (compact mode)
10. Prófa með mismunandi niðurstöðum (bætt, verri, null)

### Skrár búnar til
- `src/components/fi-calculator/FIResultsDisplay.tsx` (~200 línur)

### Athugasemdir
- Notar formatIcelandicDate fyrir íslenskar dagsetningar
- Notar formatRelativeTime fyrir afstæðan tíma
- Notar formatWorkTime fyrir lífsorku sýning
- Litakóðun: grænt = bætt, rautt = verri, hlutlaus = óbreytt
- Hreyfimynd (optional með framer-motion) gerir uppfærslur meira áberandi

---

## Verkefni 9: Búa til FI Ferill Graf (FICurveChart)

**Staða**: [ ] Ekki byrjað
**Flækjustig**: Miðlungs-Hátt
**Háðir**: Verkefni 3, Verkefni 5
**Tími**: 4-5 klst

### Lýsing
Búa til gagnvirkt línurit sem sýnir samband sparnaðarhlutfalls og ára til FI.

### Samþykktarviðmið
- [ ] Sýnir feril með recharts library
- [ ] X-ás: Sparnaðarhlutfall (0-100%)
- [ ] Y-ás: Ár til FI (0-40 ár)
- [ ] Núverandi staða merkt með stórum punkti
- [ ] Viðmiðunarlínur við 25%, 50%, 75%
- [ ] Tooltip sýnir nákvæma gildi
- [ ] Móttækilegt fyrir farsíma
- [ ] Aðgengilegt (alt text, lyklaborð)
- [ ] Lazy loaded til að minnka bundle size

### Útfærsluskref

1. Setja upp recharts: `npm install recharts`
2. Búa til `src/components/fi-calculator/FICurveChart.tsx`
3. Skilgreina viðmót:
   ```typescript
   interface FICurveChartProps {
     data: FICurveDataPoint[];
     currentSavingsRate: number;
     targetSavingsRate?: number;
     onPointClick?: (dataPoint: FICurveDataPoint) => void;
     height?: number;
     responsive?: boolean;
   }
   ```
4. Útfæra graf með recharts:
   ```typescript
   import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Dot } from 'recharts';

   export function FICurveChart({
     data,
     currentSavingsRate,
     targetSavingsRate,
     height = 300,
     responsive = true
   }: FICurveChartProps) {
     const chartContent = (
       <LineChart data={data}>
         <CartesianGrid strokeDasharray="3 3" />

         <XAxis
           dataKey="savingsRate"
           label={{ value: 'Sparnaðarhlutfall (%)', position: 'insideBottom', offset: -5 }}
           domain={[0, 100]}
         />

         <YAxis
           label={{ value: 'Ár til FI', angle: -90, position: 'insideLeft' }}
           domain={[0, 40]}
         />

         <Tooltip content={<CustomTooltip />} />

         <Line
           type="monotone"
           dataKey="yearsToFI"
           stroke="#0284c7"
           strokeWidth={3}
           dot={<CustomDot currentRate={currentSavingsRate} />}
         />

         {/* Viðmiðunarlínur */}
         <ReferenceLine x={25} stroke="#9ca3af" strokeDasharray="5 5" />
         <ReferenceLine x={50} stroke="#9ca3af" strokeDasharray="5 5" />
         <ReferenceLine x={75} stroke="#9ca3af" strokeDasharray="5 5" />

         {/* Núverandi staða */}
         <ReferenceLine x={currentSavingsRate} stroke="#0369a1" strokeWidth={2} />

         {/* Markmið (ef sett) */}
         {targetSavingsRate && (
           <ReferenceLine x={targetSavingsRate} stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" />
         )}
       </LineChart>
     );

     return responsive ? (
       <ResponsiveContainer width="100%" height={height}>
         {chartContent}
       </ResponsiveContainer>
     ) : (
       <div style={{ width: '100%', height }}>
         {chartContent}
       </div>
     );
   }
   ```
5. Útfæra CustomTooltip:
   ```typescript
   function CustomTooltip({ active, payload }: any) {
     if (active && payload && payload.length) {
       const data = payload[0].payload as FICurveDataPoint;
       return (
         <div className="bg-white p-4 rounded-lg shadow-lg border">
           <p className="font-semibold">{data.savingsRate}% sparnaður</p>
           <p className="text-primary-600">
             {formatRelativeTime(data.yearsToFI)} til FI
           </p>
         </div>
       );
     }
     return null;
   }
   ```
6. Útfæra CustomDot (merki núverandi stöðu):
   ```typescript
   function CustomDot({ cx, cy, payload, currentRate }: any) {
     if (Math.abs(payload.savingsRate - currentRate) < 2.5) {
       // Núverandi staða - stór punktur
       return (
         <circle
           cx={cx}
           cy={cy}
           r={8}
           fill="#0369a1"
           stroke="#fff"
           strokeWidth={2}
         />
       );
     }

     if (payload.isReference) {
       // Viðmiðunarpunktur - minni punktur
       return (
         <circle
           cx={cx}
           cy={cy}
           r={4}
           fill="#9ca3af"
         />
       );
     }

     return null; // Enginn punktur
   }
   ```
7. Bæta við aðgengiseiginleikum:
   ```typescript
   <div
     role="img"
     aria-label={`Graf sem sýnir sambandið milli sparnaðarhlutfalls og ára til fjármálafrelsis. Núverandi staða: ${currentSavingsRate}% sparnaður, ${data.find(d => d.isCurrent)?.yearsToFI.toFixed(1)} ár til FI.`}
   >
     {/* chart */}
   </div>
   ```
8. Lazy load með React.lazy:
   ```typescript
   // In parent component
   const FICurveChart = lazy(() => import('./FICurveChart'));

   <Suspense fallback={<div>Hleð grafi...</div>}>
     <FICurveChart data={fiCurveData} currentSavingsRate={savingsRate} />
   </Suspense>
   ```
9. Stíla fyrir mobile (smaller height, simplified labels)
10. Prófa á mismunandi skjástærðum og gögnum

### Skrár búnar til
- `src/components/fi-calculator/FICurveChart.tsx` (~200 línur)

### Athugasemdir
- Notar recharts fyrir fagleg og móttækileg gröf
- ResponsiveContainer passar stærð við foreldri container
- CustomTooltip sýnir íslenskan texta og snið
- Lazy loading minnkar upphafslega bundle size
- Viðmiðunarlínur við 25%, 50%, 75% hjálpa notendum setja markmið

---

## Verkefni 10: Búa til Atburðarása Samanburður (ScenarioComparison)

**Staða**: [ ] Ekki byrjað
**Flækjustig**: Miðlungs
**Háðir**: Verkefni 5, Verkefni 8
**Tími**: 4-5 klst

### Lýsing
Búa til íhluti fyrir að búa til, sýna og bera saman FI atburðarásir.

### Samþykktarviðmið
- [ ] Sýnir lista yfir allar atburðarásir
- [ ] Leyfir að bæta við atburðarás (hámark 4)
- [ ] Leyfir að eyða atburðarás (með staðfestingu)
- [ ] Leyfir að hlaða atburðarás inn í reiknivél
- [ ] Leyfir að setja atburðarás sem grunnlínu
- [ ] Sýnir samanburð töflu með lykilmælingum
- [ ] Merkir bestu atburðarás (stysta til FI)
- [ ] Merkir grunnlínu atburðarás
- [ ] Móttækilegt: tafla á desktop, kort á mobile

### Útfærsluskref

1. Búa til `src/components/fi-calculator/ScenarioCard.tsx` fyrst:
   ```typescript
   interface ScenarioCardProps {
     scenario: FIScenario;
     isBaseline: boolean;
     isOptimal: boolean;
     onLoad: () => void;
     onDelete: () => void;
     onSetBaseline: () => void;
   }
   ```
2. Útfæra ScenarioCard:
   - Sýna nafn atburðarás
   - Sýna sparnaðarhlutfall
   - Sýna FI dagsetningu
   - Sýna mismun frá grunnlínu
   - Hnappar: Hlaða, Eyða, Setja sem grunnlínu
   - Merki: ⭐ fyrir grunnlínu, 🏆 fyrir bestu
3. Búa til `src/components/fi-calculator/ScenarioComparison.tsx`:
   ```typescript
   interface ScenarioComparisonProps {
     scenarios: FIScenario[];
     baselineId: string | null;
     onScenarioSelect?: (id: string) => void;
     onScenarioDelete?: (id: string) => void;
     onScenarioAdd?: () => void;
     onSetBaseline?: (id: string) => void;
     maxScenarios?: number;
   }
   ```
4. Útfæra "Bæta við atburðarás" virkni:
   ```typescript
   const handleAddScenario = () => {
     const name = prompt('Nafn á atburðarás:', `Atburðarás ${scenarios.length + 1}`);
     if (name && onScenarioAdd) {
       onScenarioAdd(name);
     }
   };

   {scenarios.length < maxScenarios && (
     <button onClick={handleAddScenario}>
       + {FI_STRINGS.scenarios.add}
     </button>
   )}
   ```
5. Útfæra eyðing með staðfestingu:
   ```typescript
   const handleDelete = (id: string, name: string) => {
     if (confirm(`Ertu viss um að þú viljir eyða "${name}"?`)) {
       onScenarioDelete?.(id);
     }
   };
   ```
6. Útfæra taflu skoðun (desktop):
   ```typescript
   <table className="w-full">
     <thead>
       <tr>
         <th>Nafn</th>
         <th>Sparnaðarhlutfall</th>
         <th>FI Dagsetning</th>
         <th>Ár til FI</th>
         <th>vs. Grunnlína</th>
         <th>Aðgerðir</th>
       </tr>
     </thead>
     <tbody>
       {scenarios.map(scenario => (
         <tr key={scenario.id}>
           <td>
             {isBaseline(scenario) && '⭐ '}
             {isOptimal(scenario) && '🏆 '}
             {scenario.name}
           </td>
           <td>{scenario.savingsRate.toFixed(1)}%</td>
           <td>{formatIcelandicDate(scenario.results.fiDate)}</td>
           <td>{formatRelativeTime(scenario.results.yearsToFI)}</td>
           <td className={getDifferenceColor(scenario)}>
             {formatDifference(scenario)}
           </td>
           <td>
             <button onClick={() => onScenarioSelect?.(scenario.id)}>
               Hlaða
             </button>
             <button onClick={() => handleDelete(scenario.id, scenario.name)}>
               Eyða
             </button>
           </td>
         </tr>
       ))}
     </tbody>
   </table>
   ```
7. Útfæra kortaskoðun (mobile):
   ```typescript
   <div className="space-y-4">
     {scenarios.map(scenario => (
       <ScenarioCard
         key={scenario.id}
         scenario={scenario}
         isBaseline={isBaseline(scenario)}
         isOptimal={isOptimal(scenario)}
         onLoad={() => onScenarioSelect?.(scenario.id)}
         onDelete={() => handleDelete(scenario.id, scenario.name)}
         onSetBaseline={() => onSetBaseline?.(scenario.id)}
       />
     ))}
   </div>
   ```
8. Útfæra hjálparfall til að finna bestu atburðarás:
   ```typescript
   const optimalScenario = useMemo(() => {
     return scenarios.reduce((best, current) =>
       current.results.yearsToFI < best.results.yearsToFI ? current : best
     );
   }, [scenarios]);
   ```
9. Útfæra litakóðun fyrir mismun:
   ```typescript
   function getDifferenceColor(scenario: FIScenario): string {
     if (!scenario.results.changeFromBaseline) return 'text-neutral-600';

     const { months } = scenario.results.changeFromBaseline;
     if (months > 0) return 'text-fi-success'; // Fyrr = betra
     if (months < 0) return 'text-fi-danger';  // Seinna = verra
     return 'text-neutral-600';
   }
   ```
10. Stíla með Tailwind CSS
11. Prófa með 0, 1, 2, 3, 4 atburðarásir

### Skrár búnar til
- `src/components/fi-calculator/ScenarioCard.tsx` (~100 línur)
- `src/components/fi-calculator/ScenarioComparison.tsx` (~250 línur)

### Athugasemdir
- Hámark 4 atburðarásir til að forðast of flókinn samanburð
- Grunnlína merkt með ⭐ stjörnu
- Besta atburðarás (stysta til FI) merkt með 🏆 bikar
- Responsive: tafla á desktop, kort á mobile
- Eyðingarstaðfesting til að koma í veg fyrir slysaeyðingar

---

## Verkefni 11: Búa til Framvindu Rakning (ProgressTracker)

**Staða**: [ ] Ekki byrjað
**Flækjustig**: Miðlungs
**Háðir**: Verkefni 3, Verkefni 5
**Tími**: 3-4 klst

### Lýsing
Búa til íhlut til að sýna framvindu til FI með sögulegu gögnum og þróun.

### Samþykktarviðmið
- [ ] Sýnir lista yfir allar skyndimyndir (snapshots)
- [ ] Leyfir að bæta við nýrri skyndimynd
- [ ] Sýnir framvindu graf (FI dagsetning yfir tíma)
- [ ] Sýnir þróun (improving, stable, declining)
- [ ] Sýnir hversu marga mánuði nær FI frá fyrstu skyndimynd
- [ ] Hvetjandi skilaboð fyrir góða framvindu
- [ ] Stuðnings skilaboð fyrir afturför
- [ ] Aðeins sýnist ef skyndimyndir eru til

### Útfærsluskref

1. Búa til `src/components/fi-calculator/ProgressTracker.tsx`
2. Skilgreina viðmót:
   ```typescript
   interface ProgressTrackerProps {
     snapshots: FISnapshot[];
     currentResults: FIResults | null;
     onAddSnapshot: (notes?: string) => void;
     onDeleteSnapshot: (id: string) => void;
     trend: 'improving' | 'stable' | 'declining' | 'insufficient-data';
   }
   ```
3. Sýna aðeins ef skyndimyndir eru til:
   ```typescript
   if (snapshots.length === 0) {
     return (
       <div className="bg-neutral-50 rounded-lg p-6 text-center">
         <p className="text-neutral-600 mb-4">
           Engar framvinduskyndimyndir ennþá
         </p>
         <button onClick={() => onAddSnapshot()}>
           Búa til fyrstu skyndimyndina
         </button>
       </div>
     );
   }
   ```
4. Útfæra "Bæta við skyndimynd" virkni:
   ```typescript
   const handleAddSnapshot = () => {
     const notes = prompt('Athugasemdir (valfrjálst):');
     onAddSnapshot(notes || undefined);
   };
   ```
5. Útfæra þróunarsýning:
   ```typescript
   const trendConfig = {
     improving: {
       color: 'text-fi-success',
       icon: '📈',
       message: 'Frábært! Þú ert að nálgast markmiðið',
     },
     stable: {
       color: 'text-neutral-600',
       icon: '➡️',
       message: 'Stöðugt á réttri leið',
     },
     declining: {
       color: 'text-fi-warning',
       icon: '📉',
       message: 'Íhugaðu að endurskoða útgjöld eða tekjur',
     },
     'insufficient-data': {
       color: 'text-neutral-500',
       icon: 'ℹ️',
       message: 'Bættu við fleiri skyndimyndum til að sjá þróun',
     },
   };

   const config = trendConfig[trend];

   <div className={`${config.color} text-lg font-semibold`}>
     {config.icon} {config.message}
   </div>
   ```
6. Útfæra framvindugraf (einfalt línurit):
   ```typescript
   import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

   const chartData = snapshots
     .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
     .map(snapshot => ({
       date: new Date(snapshot.timestamp).toLocaleDateString('is-IS'),
       yearsToFI: snapshot.yearsToFI,
       timestamp: snapshot.timestamp,
     }));

   <ResponsiveContainer width="100%" height={200}>
     <LineChart data={chartData}>
       <XAxis dataKey="date" />
       <YAxis label={{ value: 'Ár til FI', angle: -90 }} />
       <Tooltip />
       <Line type="monotone" dataKey="yearsToFI" stroke="#0284c7" />
     </LineChart>
   </ResponsiveContainer>
   ```
7. Útfæra framvindu mælingu:
   ```typescript
   const progressMonths = useMemo(() => {
     if (snapshots.length < 2) return 0;

     const sorted = [...snapshots].sort((a, b) =>
       new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
     );

     const first = sorted[0];
     const last = sorted[sorted.length - 1];

     const improvement = (first.yearsToFI - last.yearsToFI) * 12;
     const monthsElapsed = (new Date(last.timestamp).getTime() - new Date(first.timestamp).getTime())
       / (1000 * 60 * 60 * 24 * 30);

     return Math.round(improvement - monthsElapsed);
   }, [snapshots]);

   {progressMonths > 0 && (
     <div className="text-fi-success text-xl">
       Þú ert {progressMonths} mánuðum nær FI! 🎉
     </div>
   )}
   ```
8. Útfæra skyndimyndalista:
   ```typescript
   <div className="space-y-2 mt-4">
     {snapshots
       .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
       .map(snapshot => (
         <div key={snapshot.id} className="flex justify-between items-center p-3 bg-white rounded border">
           <div>
             <div className="font-semibold">
               {new Date(snapshot.timestamp).toLocaleDateString('is-IS')}
             </div>
             <div className="text-sm text-neutral-600">
               {snapshot.savingsRate.toFixed(1)}% sparnaður,{' '}
               {formatRelativeTime(snapshot.yearsToFI)} til FI
             </div>
             {snapshot.notes && (
               <div className="text-sm text-neutral-500 italic">
                 {snapshot.notes}
               </div>
             )}
           </div>
           <button onClick={() => onDeleteSnapshot(snapshot.id)}>
             Eyða
           </button>
         </div>
       ))}
   </div>
   ```
9. Stíla með Tailwind CSS
10. Prófa með mismunandi fjölda skyndimynda og þróunum

### Skrár búnar til
- `src/components/fi-calculator/ProgressTracker.tsx` (~200 línur)

### Athugasemdir
- Krefst að minnsta kosti 2 skyndimynda fyrir þróunarútreikning
- Sýnir hvetjandi skilaboð fyrir góða framvindu
- Sýnir stuðningsskilaboð með tillögum fyrir afturför
- Einföld grafík með recharts fyrir framvindu yfir tíma
- Skyndimyndir raðaðar með nýjustu efst

---

## Verkefni 12: Búa til aðalsíðu Sparnaðarhlutfall

**Staða**: [ ] Ekki byrjað
**Flækjustig**: Miðlungs
**Háðir**: Verkefni 6-11
**Tími**: 4-5 klst

### Lýsing
Setja saman alla íhluti í aðalsíðu sparnaðarhlutfall reiknivélarinnar.

### Samþykktarviðmið
- [ ] Samþættir alla íhluti (inntök, rennislá, niðurstöður, ferill, atburðarásir)
- [ ] Layout virkar á desktop og mobile
- [ ] Sýnir rétta hluti eftir stöðu (null results, valid results)
- [ ] Samþættir CalculatorContext
- [ ] Vista/Flytja út/Núllstilla virkni
- [ ] Loading states fyrir ósamstilltar aðgerðir
- [ ] Móttækilegt fyrir alla skjástærðir

### Útfærsluskref

1. Búa til `src/app/sparnadarhlutfall/page.tsx`
2. Sækja gögn úr CalculatorContext:
   ```typescript
   'use client';

   import { useCalculatorContext } from '@/context/CalculatorContext';

   export default function SavingsRateSliderPage() {
     const {
       fiInputs,
       updateFIInputs,
       fiResults,
       scenarios,
       addScenario,
       deleteScenario,
       loadScenario,
       setBaseline,
       baselineScenarioId,
       snapshots,
       addSnapshot,
       deleteSnapshot,
       fiCurveData,
       progressTrend,
       actualHourlyWage,
     } = useCalculatorContext();

     // ... implementation
   }
   ```
3. Útfæra layout fyrir desktop:
   ```tsx
   <div className="container mx-auto px-4 py-8">
     <header className="mb-8">
       <h1 className="text-4xl font-bold">{FI_STRINGS.title}</h1>
       <p className="text-neutral-600 mt-2">{FI_STRINGS.subtitle}</p>
     </header>

     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
       {/* Left column: Inputs */}
       <div className="lg:col-span-1">
         <FIInputsSection
           inputs={fiInputs}
           onChange={updateFIInputs}
         />
       </div>

       {/* Right column: Results */}
       <div className="lg:col-span-2">
         <FIResultsDisplay
           results={fiResults}
           showLifeEnergy
           showMarginalImpact
         />
       </div>
     </div>

     {/* Slider (full width) */}
     <div className="mt-8">
       <SavingsRateSlider
         value={fiInputs.currentSavingsRate || 0}
         onChange={(value) => updateFIInputs({ currentSavingsRate: value })}
         currentRate={calculateSavingsRate(fiInputs.annualIncome, fiInputs.annualExpenses)}
         showQuickAdjust
       />
     </div>

     {/* Charts and comparison */}
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
       <div>
         <h2 className="text-2xl font-bold mb-4">Ferill</h2>
         <Suspense fallback={<div>Hleð grafi...</div>}>
           <FICurveChart
             data={fiCurveData}
             currentSavingsRate={fiInputs.currentSavingsRate || 0}
           />
         </Suspense>
       </div>

       <div>
         <h2 className="text-2xl font-bold mb-4">Lífsorka</h2>
         <LifeEnergyDisplay results={fiResults} />
       </div>
     </div>

     {/* Scenarios */}
     <div className="mt-8">
       <h2 className="text-2xl font-bold mb-4">Atburðarásir</h2>
       <ScenarioComparison
         scenarios={scenarios}
         baselineId={baselineScenarioId}
         onScenarioAdd={(name) => addScenario(name)}
         onScenarioDelete={deleteScenario}
         onScenarioSelect={loadScenario}
         onSetBaseline={setBaseline}
       />
     </div>

     {/* Progress tracking */}
     {snapshots.length > 0 && (
       <div className="mt-8">
         <h2 className="text-2xl font-bold mb-4">Framvinda</h2>
         <ProgressTracker
           snapshots={snapshots}
           currentResults={fiResults}
           onAddSnapshot={addSnapshot}
           onDeleteSnapshot={deleteSnapshot}
           trend={progressTrend}
         />
       </div>
     )}
   </div>
   ```
4. Útfæra mobile layout (stack vertically):
   ```tsx
   <div className="lg:hidden">
     {/* Mobile: Results sticky at top */}
     <div className="sticky top-0 z-10 bg-white shadow-md p-4 mb-4">
       <FIResultsDisplay results={fiResults} compactMode />
     </div>

     {/* Mobile: Slider prominent */}
     <div className="mb-6">
       <SavingsRateSlider
         value={fiInputs.currentSavingsRate || 0}
         onChange={(value) => updateFIInputs({ currentSavingsRate: value })}
         currentRate={calculateSavingsRate(fiInputs.annualIncome, fiInputs.annualExpenses)}
         showQuickAdjust
       />
     </div>

     {/* Mobile: Collapsible sections */}
     <Accordion>
       <AccordionItem title="Inntök">
         <FIInputsSection inputs={fiInputs} onChange={updateFIInputs} compactMode />
       </AccordionItem>
       <AccordionItem title="Ferill">
         <FICurveChart data={fiCurveData} currentSavingsRate={fiInputs.currentSavingsRate || 0} />
       </AccordionItem>
       <AccordionItem title="Atburðarásir">
         <ScenarioComparison scenarios={scenarios} /* ... */ />
       </AccordionItem>
     </Accordion>
   </div>
   ```
5. Útfæra Vista/Flytja út hnappar:
   ```tsx
   <div className="flex gap-4 mt-8">
     <button onClick={() => addSnapshot()}>
       Vista Skyndimynd
     </button>
     <button onClick={handleExport}>
       Flytja út
     </button>
     <button onClick={handleReset}>
       Núllstilla
     </button>
   </div>
   ```
6. Útfæra loading states:
   ```tsx
   {!fiResults && (
     <div className="text-center py-12">
       <p className="text-neutral-600 text-lg">
         Fylltu út FI inntök til að byrja
       </p>
     </div>
   )}
   ```
7. Bæta við SEO metadata:
   ```tsx
   export const metadata = {
     title: 'Sparnaðarhlutfall Reiknivél | peninganaedalifid.is',
     description: 'Sjáðu hvernig sparnaðarhlutfall hefur áhrif á fjármálafrelsi',
   };
   ```
8. Stíla með Tailwind CSS
9. Prófa á desktop, tablet, mobile
10. Prófa með mismunandi stöðum (engin gögn, gild gögn, villur)

### Skrár búnar til
- `src/app/sparnadarhlutfall/page.tsx` (~300 línur)

### Athugasemdir
- Notar grid layout fyrir desktop, stack fyrir mobile
- Niðurstöður sticky efst á mobile fyrir auðvelda yfirsýn
- Lazy loads graf til að bæta afköst
- Collapsible sections á mobile til að minnka skrunun
- SEO metadata fyrir betri leitarvélabestun

---

## Verkefni 13: Skrifa próf og lokafágering

**Staða**: [ ] Ekki byrjað
**Flækjustig**: Miðlungs
**Háðir**: Verkefni 1-12
**Tími**: 6-8 klst

### Lýsing
Skrifa alhliða próf fyrir alla FI reiknivél íhluti og föll.

### Samþykktarviðmið
- [ ] Einingapróf fyrir öll útreikningsföll (≥90% þekja)
- [ ] Einingapróf fyrir öll hjálparföll (formatters, validators)
- [ ] Íhlutapróf fyrir alla React íhluti
- [ ] Samþættingarpróf fyrir CalculatorContext
- [ ] E2E próf fyrir algeng notendaferli
- [ ] Performance próf (útreikningar < 100ms)
- [ ] Aðgengipróf (a11y)
- [ ] Öll próf ná árangri

### Útfærsluskref

#### 1. Einingapróf fyrir útreikninga

1. Skrifa `tests/lib/calculations/fi.test.ts`:
   ```typescript
   describe('calculateYearsToFI', () => {
     it('should return 0 if already at FI', () => {
       const result = calculateYearsToFI(1000000, 100000, 1000000, 7);
       expect(result).toBe(0);
     });

     it('should return Infinity for negative savings', () => {
       const result = calculateYearsToFI(1000000, -50000, 0, 7);
       expect(result).toBe(Infinity);
     });

     it('should calculate correct years for standard case', () => {
       // FI: 10M, Annual Savings: 2M, Current: 0, Return: 7%
       const result = calculateYearsToFI(10000000, 2000000, 0, 7);
       expect(result).toBeCloseTo(4.3, 1); // ~4.3 years
     });

     it('should handle 0% return rate', () => {
       const result = calculateYearsToFI(1000000, 100000, 0, 0);
       expect(result).toBe(10); // Simple division
     });

     it('should not return negative years', () => {
       const result = calculateYearsToFI(1000000, 2000000, 0, 7);
       expect(result).toBeGreaterThanOrEqual(0);
     });
   });

   describe('calculateMarginalImpact', () => {
     it('should calculate positive impact for increased savings', () => {
       const inputs = {
         fiNumber: 10000000,
         annualIncome: 5000000,
         annualExpenses: 3000000,
         currentNetWorth: 0,
         expectedReturnRate: 7,
         fiMultiplier: 25,
         currentSavingsRate: 40,
       };

       const currentYears = calculateYearsToFI(
         inputs.fiNumber,
         calculateAnnualSavings(inputs.annualIncome, 40),
         inputs.currentNetWorth,
         inputs.expectedReturnRate
       );

       const impact = calculateMarginalImpact(inputs, currentYears, 1);

       expect(impact.months).toBeGreaterThan(0);
       expect(impact.years).toBeGreaterThan(0);
     });
   });

   describe('generateFICurveData', () => {
     it('should generate data points from 0 to 100%', () => {
       const inputs = {
         fiNumber: 10000000,
         annualIncome: 5000000,
         annualExpenses: 3000000,
         currentNetWorth: 0,
         expectedReturnRate: 7,
         fiMultiplier: 25,
       };

       const data = generateFICurveData(inputs, 40, 5);

       expect(data.length).toBe(21); // 0, 5, 10, ..., 100 (21 points)
       expect(data[0].savingsRate).toBe(0);
       expect(data[data.length - 1].savingsRate).toBe(100);
     });

     it('should mark current savings rate', () => {
       const inputs = {
         fiNumber: 10000000,
         annualIncome: 5000000,
         annualExpenses: 3000000,
         currentNetWorth: 0,
         expectedReturnRate: 7,
         fiMultiplier: 25,
       };

       const data = generateFICurveData(inputs, 40, 5);
       const currentPoint = data.find(d => d.isCurrent);

       expect(currentPoint).toBeDefined();
       expect(currentPoint?.savingsRate).toBeCloseTo(40, 0);
     });
   });
   ```

#### 2. Einingapróf fyrir hjálparföll

2. Skrifa `tests/lib/utils/dateFormatters.test.ts`:
   ```typescript
   describe('formatIcelandicDate', () => {
     it('should format date in Icelandic', () => {
       const date = new Date(2035, 7, 15); // August 15, 2035
       const result = formatIcelandicDate(date);
       expect(result).toBe('ágúst 2035');
     });
   });

   describe('formatRelativeTime', () => {
     it('should format years only', () => {
       expect(formatRelativeTime(5.0)).toBe('5 ár');
     });

     it('should format years and months', () => {
       expect(formatRelativeTime(5.5)).toBe('5 ár og 6 mánuðir');
     });

     it('should format months only for < 1 year', () => {
       expect(formatRelativeTime(0.5)).toBe('6 mánuðir');
     });

     it('should handle single month', () => {
       expect(formatRelativeTime(1/12)).toBe('1 mánuður');
     });
   });

   describe('formatISK', () => {
     it('should format with Icelandic thousand separator', () => {
       expect(formatISK(10000)).toBe('10.000 kr');
     });

     it('should not show decimals', () => {
       expect(formatISK(10000.99)).toBe('10.001 kr');
     });
   });

   describe('formatWorkTime', () => {
     it('should format hours for < 1000 hours', () => {
       expect(formatWorkTime(500)).toBe('500 vinnustundir');
     });

     it('should format days for 1000-10000 hours', () => {
       expect(formatWorkTime(2000)).toBe('250 vinnudagar');
     });

     it('should format years for > 10000 hours', () => {
       expect(formatWorkTime(20000)).toBe('10.0 vinnuár');
     });
   });
   ```

3. Skrifa `tests/lib/utils/fiValidators.test.ts`:
   ```typescript
   describe('validateFIInputs', () => {
     it('should pass for valid inputs', () => {
       const inputs = {
         fiNumber: 10000000,
         annualIncome: 5000000,
         annualExpenses: 3000000,
         currentNetWorth: 1000000,
         expectedReturnRate: 7,
         fiMultiplier: 25,
       };

       const result = validateFIInputs(inputs);
       expect(result.isValid).toBe(true);
       expect(Object.keys(result.errors)).toHaveLength(0);
     });

     it('should fail for negative FI number', () => {
       const inputs = { /* ... */ fiNumber: -1000000 };
       const result = validateFIInputs(inputs);

       expect(result.isValid).toBe(false);
       expect(result.errors.fiNumber).toBeDefined();
     });

     it('should warn for expenses >= income', () => {
       const inputs = {
         fiNumber: 10000000,
         annualIncome: 3000000,
         annualExpenses: 3000000,
         currentNetWorth: 0,
         expectedReturnRate: 7,
         fiMultiplier: 25,
       };

       const result = validateFIInputs(inputs);
       expect(result.warnings.annualExpenses).toBeDefined();
     });
   });
   ```

#### 3. Íhlutapróf

4. Skrifa `tests/components/fi-calculator/SavingsRateSlider.test.tsx`:
   ```typescript
   import { render, screen, fireEvent } from '@testing-library/react';
   import { SavingsRateSlider } from '@/components/fi-calculator/SavingsRateSlider';

   describe('SavingsRateSlider', () => {
     it('should render with current value', () => {
       render(
         <SavingsRateSlider
           value={40}
           currentRate={35}
           onChange={jest.fn()}
         />
       );

       const slider = screen.getByRole('slider');
       expect(slider).toHaveValue('40');
     });

     it('should call onChange when slider moves', () => {
       const onChange = jest.fn();
       render(
         <SavingsRateSlider
           value={40}
           currentRate={35}
           onChange={onChange}
         />
       );

       const slider = screen.getByRole('slider');
       fireEvent.change(slider, { target: { value: '50' } });

       // Debounced, so need to wait
       setTimeout(() => {
         expect(onChange).toHaveBeenCalledWith(50);
       }, 150);
     });

     it('should show quick adjust buttons', () => {
       render(
         <SavingsRateSlider
           value={40}
           currentRate={35}
           onChange={jest.fn()}
           showQuickAdjust
         />
       );

       expect(screen.getByText('+5%')).toBeInTheDocument();
       expect(screen.getByText('+10%')).toBeInTheDocument();
       expect(screen.getByText('+15%')).toBeInTheDocument();
     });
   });
   ```

5. Skrifa `tests/components/fi-calculator/FIResultsDisplay.test.tsx`:
   ```typescript
   describe('FIResultsDisplay', () => {
     it('should display FI date in Icelandic', () => {
       const results = {
         fiDate: new Date(2035, 7, 1),
         yearsToFI: 9.5,
         // ... other fields
       };

       render(<FIResultsDisplay results={results} />);

       expect(screen.getByText(/ágúst 2035/i)).toBeInTheDocument();
       expect(screen.getByText(/9 ár og 6 mánuðir/i)).toBeInTheDocument();
     });

     it('should show placeholder when no results', () => {
       render(<FIResultsDisplay results={null} />);

       expect(screen.getByText(/fylltu út/i)).toBeInTheDocument();
     });

     it('should color-code improvements', () => {
       const results = {
         fiDate: new Date(2035, 7, 1),
         yearsToFI: 9.5,
         changeFromBaseline: {
           months: 12,
           years: 1,
           percentage: 10,
         },
         // ... other fields
       };

       render(<FIResultsDisplay results={results} />);

       const change = screen.getByText(/fyrr/i);
       expect(change).toHaveClass('text-fi-success');
     });
   });
   ```

#### 4. Samþættingarpróf

6. Skrifa `tests/context/CalculatorContext.fi.test.tsx`:
   ```typescript
   describe('CalculatorContext FI Integration', () => {
     it('should calculate FI results when inputs change', () => {
       const { result } = renderHook(() => useCalculatorContext(), {
         wrapper: CalculatorProvider,
       });

       act(() => {
         result.current.updateFIInputs({
           fiNumber: 10000000,
           annualIncome: 5000000,
           annualExpenses: 3000000,
           currentNetWorth: 0,
           expectedReturnRate: 7,
           fiMultiplier: 25,
         });
       });

       expect(result.current.fiResults).not.toBeNull();
       expect(result.current.fiResults?.yearsToFI).toBeGreaterThan(0);
     });

     it('should add and delete scenarios', () => {
       const { result } = renderHook(() => useCalculatorContext(), {
         wrapper: CalculatorProvider,
       });

       // Set up inputs first
       act(() => {
         result.current.updateFIInputs({ /* valid inputs */ });
       });

       // Add scenario
       act(() => {
         result.current.addScenario('Test Scenario');
       });

       expect(result.current.scenarios).toHaveLength(1);
       expect(result.current.scenarios[0].name).toBe('Test Scenario');

       // Delete scenario
       act(() => {
         result.current.deleteScenario(result.current.scenarios[0].id);
       });

       expect(result.current.scenarios).toHaveLength(0);
     });
   });
   ```

#### 5. E2E próf

7. Skrifa `tests/e2e/savings-rate-slider.spec.ts` (með Playwright):
   ```typescript
   import { test, expect } from '@playwright/test';

   test.describe('Savings Rate Slider E2E', () => {
     test('complete workflow: inputs → slider → results → scenario', async ({ page }) => {
       await page.goto('/sparnadarhlutfall');

       // Fill inputs
       await page.fill('[aria-label="FI Markmið"]', '10000000');
       await page.fill('[aria-label="Árstekjur"]', '5000000');
       await page.fill('[aria-label="Árleg útgjöld"]', '3000000');

       // Wait for calculation
       await page.waitForSelector('text=/ár til/i');

       // Move slider
       const slider = page.locator('[role="slider"]');
       await slider.fill('50');

       // Wait for recalculation
       await page.waitForTimeout(200);

       // Verify results updated
       const fiDate = await page.textContent('[data-testid="fi-date"]');
       expect(fiDate).toBeTruthy();

       // Add scenario
       await page.click('text=/bæta við atburðarás/i');
       await page.fill('[placeholder="Nafn á atburðarás"]', 'Test Scenario');
       await page.click('text=/vista/i');

       // Verify scenario appears
       await expect(page.locator('text=Test Scenario')).toBeVisible();
     });
   });
   ```

#### 6. Performance próf

8. Skrifa `tests/performance/fi-calculations.perf.test.ts`:
   ```typescript
   describe('FI Calculations Performance', () => {
     it('should calculate results in < 100ms', () => {
       const inputs = {
         fiNumber: 10000000,
         annualIncome: 5000000,
         annualExpenses: 3000000,
         currentNetWorth: 0,
         expectedReturnRate: 7,
         fiMultiplier: 25,
         currentSavingsRate: 40,
       };

       const start = performance.now();
       const results = calculateFIResults(inputs);
       const end = performance.now();

       expect(end - start).toBeLessThan(100);
       expect(results).toBeDefined();
     });

     it('should generate curve data in < 200ms', () => {
       const inputs = { /* ... */ };

       const start = performance.now();
       const data = generateFICurveData(inputs, 40, 1); // 1% step for 101 points
       const end = performance.now();

       expect(end - start).toBeLessThan(200);
       expect(data.length).toBe(101);
     });
   });
   ```

#### 7. Aðgengipróf

9. Skrifa `tests/a11y/savings-rate-slider.a11y.test.tsx`:
   ```typescript
   import { axe, toHaveNoViolations } from 'jest-axe';

   expect.extend(toHaveNoViolations);

   describe('Savings Rate Slider Accessibility', () => {
     it('should have no a11y violations on main page', async () => {
       const { container } = render(<SavingsRateSliderPage />);
       const results = await axe(container);

       expect(results).toHaveNoViolations();
     });

     it('should have accessible slider', async () => {
       const { container } = render(
         <SavingsRateSlider value={40} currentRate={35} onChange={jest.fn()} />
       );
       const results = await axe(container);

       expect(results).toHaveNoViolations();
     });
   });
   ```

#### 8. Keyra öll próf

10. Uppfæra `package.json` með próf skipunum:
    ```json
    {
      "scripts": {
        "test": "jest",
        "test:watch": "jest --watch",
        "test:coverage": "jest --coverage",
        "test:e2e": "playwright test",
        "test:a11y": "jest --testPathPattern=a11y",
        "test:all": "npm run test && npm run test:e2e && npm run test:a11y"
      }
    }
    ```

11. Keyra öll próf:
    ```bash
    npm run test:all
    ```

12. Sannprófa þekju:
    ```bash
    npm run test:coverage
    ```
    - Markmið: ≥ 90% fyrir útreikningsföll
    - Markmið: ≥ 80% fyrir React íhluti

### Skrár búnar til
- `tests/lib/calculations/fi.test.ts` (~300 línur)
- `tests/lib/utils/dateFormatters.test.ts` (~100 línur)
- `tests/lib/utils/fiValidators.test.ts` (~150 línur)
- `tests/components/fi-calculator/SavingsRateSlider.test.tsx` (~150 línur)
- `tests/components/fi-calculator/FIResultsDisplay.test.tsx` (~150 línur)
- `tests/context/CalculatorContext.fi.test.tsx` (~200 línur)
- `tests/e2e/savings-rate-slider.spec.ts` (~100 línur)
- `tests/performance/fi-calculations.perf.test.ts` (~100 línur)
- `tests/a11y/savings-rate-slider.a11y.test.tsx` (~100 línur)

### Athugasemdir
- Notar Jest fyrir einingapróf og íhlutapróf
- Notar Playwright fyrir E2E próf
- Notar jest-axe fyrir aðgengipróf
- Performance próf ganga úr skugga um snöggar uppfærslur
- Markmið: ≥90% þekja fyrir mikilvæg föll

---

## Verkefni 14: Heimildaskjölun og deployment

**Staða**: [ ] Ekki byrjað
**Flækjustig**: Einfalt
**Háðir**: Verkefni 1-13
**Tími**: 2-3 klst

### Lýsing
Skrifa heimildaskjöl og undirbúa fyrir deployment.

### Samþykktarviðmið
- [ ] README.md uppfært með FI reiknivél upplýsingum
- [ ] API heimildaskjöl fyrir CalculatorContext FI aðferðir
- [ ] Komponent heimildaskjöl með dæmum
- [ ] Deployment athugunarlisti lokið
- [ ] Performance uppfært í production

### Útfærsluskref

1. Uppfæra `README.md` með FI reiknivél hluta
2. Skrifa `docs/FI_CALCULATOR.md` með:
   - Yfirlit yfir eiginleika
   - Hvernig á að nota reiknivélina
   - Formúlur og útreikningar
   - Dæmi um notkunartilfelli
3. Skrifa `docs/FI_API.md` með:
   - CalculatorContext FI aðferðir
   - Dæmi um notkun
   - TypeScript týpur
4. Bæta við Storybook stories fyrir alla íhluti (optional)
5. Deployment athugunarlisti:
   - [ ] Öll próf ná árangri
   - [ ] Lighthouse skor ≥ 90
   - [ ] Bundle size < 50KB fyrir FI calculator
   - [ ] Íslensku strengir allir réttir
   - [ ] Mobile próf á raunverulegum tækjum
   - [ ] Aðgengipróf ≥ 95%
6. Deploy á Vercel (staging fyrst)
7. Prófa á staging með raunverulegum gögnum
8. Deploy á production

### Skrár búnar til
- `README.md` (uppfært)
- `docs/FI_CALCULATOR.md` (~200 línur)
- `docs/FI_API.md` (~150 línur)

### Athugasemdir
- Heimildaskjöl á íslensku fyrir notendur, enska fyrir þróunaraðila
- Deployment athugunarlisti tryggir gæði
- Storybook stories (optional) hjálpa við íhluta þróun

---

## Útfærslurröð (Implementation Sequence)

### Fasi 1: Grunnur (Vikur 1)
1. ✅ Verkefni 1: TypeScript týpur
2. ✅ Verkefni 2: Fastar og sjálfgefin gildi
3. ✅ Verkefni 3: FI útreikningavél
4. ✅ Verkefni 4: Íslensku hjálparföll

**Athugasemd**: Fasi 1 leggur grunninn með öllum útreikningum og týpum.

### Fasi 2: Samþætting og Inntök (Vika 2)
5. ✅ Verkefni 5: Uppfæra CalculatorContext
6. ✅ Verkefni 6: FI Inntakshópur

**Athugasemd**: Fasi 2 tengir útreikningavélina við appið og býr til inntaksviðmót.

### Fasi 3: Aðal Eiginleikar (Vika 2-3)
7. ✅ Verkefni 7: Sparnaðarhlutfall Rennislá
8. ✅ Verkefni 8: FI Niðurstöður Sýning
9. ✅ Verkefni 9: FI Ferill Graf

**Athugasemd**: Fasi 3 útfærir helstu gagnvirku eiginleika.

### Fasi 4: Ítarlegir Eiginleikar (Vika 3-4)
10. ✅ Verkefni 10: Atburðarása Samanburður
11. ✅ Verkefni 11: Framvindu Rakning
12. ✅ Verkefni 12: Aðalsíða

**Athugasemd**: Fasi 4 bætir við samanburði, framvindu rakningu og setur allt saman.

### Fasi 5: Gæði og Deployment (Vika 4-5)
13. ✅ Verkefni 13: Próf og fágering
14. ✅ Verkefni 14: Heimildaskjöl og deployment

**Athugasemd**: Fasi 5 tryggir gæði, próf og tilbúinn fyrir production.

---

## Áætluð Tímalína

| Vika | Verkefni | Tími | Staða |
|------|----------|------|-------|
| 1 | Verkefni 1-4 | 8-12 klst | Ekki byrjað |
| 2 | Verkefni 5-7 | 10-12 klst | Ekki byrjað |
| 3 | Verkefni 8-9 | 8-10 klst | Ekki byrjað |
| 4 | Verkefni 10-12 | 12-15 klst | Ekki byrjað |
| 5 | Verkefni 13-14 | 8-11 klst | Ekki byrjað |
| **Samtals** | **1-14** | **46-60 klst** | **0/14 lokið** |

---

## Áhætta og Aðvörun

### Hugsanlegar Áskoranir

1. **Stærðfræði Villur**: FI útreikningar nota logarithma og geta verið viðkvæmir fyrir jaðartilvikum
   - **Úrræði**: Ítarleg einingapróf með edge cases

2. **Performance á Mobile**: Ferill graf gæti verið hægt á eldri farsímum
   - **Úrræði**: Lazy loading, minni gagnapunkta á mobile

3. **Icelandic Number Formatting**: Intl.NumberFormat gæti ekki virk á öllum browsers
   - **Úrræði**: Fallback snið með regex

4. **LocalStorage Quota**: Margar skyndimyndir gætu fyllt quota
   - **Úrræði**: Hámark 100 skyndimyndir, elstu fjarlægðar sjálfkrafa

5. **Complex State Management**: FI state er flókið með scenarios, snapshots, what-if
   - **Úrræði**: Vandað til verka með useMemo, useCallback fyrir afköst

### Gæðatrygging

- ✅ Einingapróf fyrir öll útreikningsföll
- ✅ Íhlutapróf fyrir alla React íhluti
- ✅ E2E próf fyrir algeng ferli
- ✅ Performance próf (< 100ms uppfærslur)
- ✅ Aðgengipróf (WCAG AA)
- ✅ Mobile próf á raunverulegum tækjum
- ✅ Cross-browser próf (Chrome, Firefox, Safari, Edge)

---

## Lokaatriði

Þessi verkefnalýsing veitir ítarlega vegakort fyrir útfærslu Sparnaðarhlutfall Reiknivélar. Hver verkefni er sjálfstætt og prófanlegt, með skýrum forsendum og samþykktarviðmiðum.

**Næstu skref**:
1. Byrjaðu á Verkefni 1 (TypeScript týpur)
2. Fylgdu útfærslurröðinni í réttri röð
3. Merktu verkefni sem lokið eftir því sem þau klárast
4. Prófa reglulega á meðan á þróun stendur
5. Uppfæra þessa skrá með athugasemdum og niðurstöðum

**Til hamingju með þróunina!** 🚀
