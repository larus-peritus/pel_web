# Hönnunarskjal: Matkostnaðarmælir (Meal Cost Calculator)

## Yfirlit

### Tilgangur

Matkostnaðarmælir (Meal Cost Calculator) er eiginleiki fyrir peninganaedalifid.is sem hjálpar notendum að skilja raunverulegan kostnað mataræðisvenja sinna með því að bera saman kostnað þess að borða úti við heimaeldun. Eiginleikinn sýnir ekki bara peningalegan kostnað heldur einnig lífsorku kostnað (tíma umreiknað í klukkustundir) og áhrif á fjárhagslegt frelsi (FI) í framtíðinni.

### Lykilatriði

**Arkitektúr**:
- Client-side React application með TypeScript
- Pure function calculations í aðskildum calculation library
- Integration með CalculatorContext fyrir actualHourlyWage og state management
- localStorage fyrir viðvarandi geymslu
- Engir ytri API köll - allt keyrir í vafra

**Aðalíhlutir**:
1. **MealCostCalculator** - Container component sem samræmir alla virkni
2. **EatingOutInputs** - Innsláttur fyrir mataræði utan heimilis (máltíðir, kaffi, skyndibitir)
3. **HomeCookingInputs** - Innsláttur fyrir heimaeldunar kostnað (matvörur, tími)
4. **MealCostComparison** - Samanburður á kostnaði með lífsorku og framtíðarverðmæti
5. **MealPresetSelector** - Forstilltar atburðarásir til samanburðar
6. **MealCostBreakdown** - Sundurliðun á öllum kostnaðarþáttum

**Gagnalíkön**:
- `MealCostData` - Aðalgögn (eatingOut + homeCooking)
- `EatingOutData` - Mat úti gögn (5 meal categories)
- `HomeCookingData` - Heimaeldun gögn (groceries, time, household size)
- `MealCostSummary` - Útreiknaðar niðurstöður fyrir hvorn valkost
- `ComparisonResults` - Samanburður með future value
- `MealScenarioPreset` - Forstillt atburðarás

**Útreikningalógík**:
- **Eating Out**: Σ(meal_count × meal_cost) fyrir öll meal categories
- **Home Cooking**: (Groceries/4.33) + (ShoppingTime × Wage) + (CookingTime × Wage)
- **Life Energy**: Cost / ActualHourlyWage = Hours
- **Future Value**: FV = PMT × ((1 + r)^n - 1) / r við 7% ávöxtun

**Mikilvægustu hönnunarákvarðanir**:
1. **Client-side only** - Privacy-first, offline capable, instant calculations
2. **Integration með CalculatorContext** - Access to actualHourlyWage, unified export
3. **WEEKS_PER_MONTH = 4.33** - Mathematical accuracy (52/12)
4. **Include time cost** - True total cost of home cooking (YMYL philosophy)
5. **Price presets** - Faster setup with Icelandic realistic prices
6. **5 scenario presets** - Quick comparison of common eating patterns
7. **Debounce 500ms** - Performance optimization + UX balance
8. **Cost per person** - Practical for families

**Kröfurekjanleiki**:
- Allir 8 user stories (NS-1 til NS-8) addressed
- Öll non-functional requirements uppfyllt:
  - Performance: < 50ms calculations
  - Accessibility: WCAG 2.1 AA compliance
  - Responsive: 320px - 1920px+
  - Privacy: localStorage only, no server calls
  - Language: Allur texti á íslensku
  - Reliability: Auto-save, error handling

**Prófunarstefna**:
- Unit tests: 95%+ coverage fyrir calculations
- Component tests: 80%+ coverage fyrir React components
- Integration tests: CalculatorContext integration
- Accessibility tests: jest-axe + manual screen reader testing
- Manual testing: Responsive design, browser compatibility, user workflows

**Technology Stack**:
- React 18+ með TypeScript
- Next.js App Router
- Tailwind CSS fyrir stílun
- Vitest fyrir unit/component tests
- React Testing Library
- jest-axe fyrir accessibility tests

**Villustjórnun**:
- Real-time input validation með íslenskum skillaboðum
- Graceful degradation ef actualHourlyWage vantar
- Try/catch fyrir localStorage með fallback til session-only mode
- Toast notifications fyrir errors
- Type guards fyrir data validation

**Næstu skref**:
1. Fara yfir hönnunarskjal með team
2. Fá technical lead approval
3. Færa yfir í Tasks phase (task breakdown)
4. Byrja implementation

## Arkitektúr

### Heildaryfirlit (System Overview)

Matkostnaðarmælir er sjálfstæður eiginleiki sem fellur inn í núverandi peninganaedalifid.is app arkitektúr. Hann fylgir sömu hönnunarmynstrum og Áskriftamælir (Subscription Burn Meter), með áherslu á:

- **Client-side útreikningar**: Allir útreikningar framkvæmdir í vafra notanda
- **localStorage viðvarandi geymsla**: Engin netþjóns samskipti, öll gögn geymd staðbundið
- **React Context fyrir stöðustjórnun**: Integration með núverandi CalculatorContext
- **Lífsorku sýn**: Allar upphæðir birtar bæði sem krónutölur og lífsorku klukkustundir
- **Móttækileg hönnun**: Virkar á öllum skjástærðum (farsími til borðtölvu)

### Íhluta arkitektúr (Component Architecture)

Matkostnaðarmælir skiptist í fjóra aðalíhluti:

1. **MealCostCalculator** (Aðalíhlutur)
   - Ábyrgð: Samræma alla undirhluta og stjórna heildar layout
   - Stjórnar flipum/tabs milli innslátta og samanburðar
   - Stjórnar atburðarása (scenario) vali

2. **EatingOutInputs** (Innsláttareyðublöð fyrir mat úti)
   - Ábyrgð: Safna gögnum um mataræði utan heimilis
   - Máltíðir (morgun/hádegis/kvöld)
   - Kaffi og drykkjavörur
   - Skyndibitamáltíðir
   - Forstillt verð fyrir íslenskar aðstæður

3. **HomeCookingInputs** (Innsláttareyðublöð fyrir heimaeldun)
   - Ábyrgð: Safna gögnum um heimaeldunar kostnað
   - Mánaðarlegt matvörukaup
   - Fjöldi í heimili
   - Tími í innkaupum og eldun
   - Reiknað með raunverulegu tímakaupi

4. **MealCostComparison** (Samanburður og niðurstöður)
   - Ábyrgð: Sýna samanburð á milli valkosta
   - Sundurliðun kostnaðar
   - Lífsorku samanburður
   - Framtíðarverðmæti sparnaðar (FV)
   - Atburðarása samanburður

5. **MealPresetSelector** (Flýtival fyrir atburðarásir)
   - Ábyrgð: Leyfa notanda að velja forstilltar atburðarásir
   - Fylla inn dæmigerð gildi
   - Samanburðartafla

### Gagnaflæði (Data Flow)

```
1. Notandi slær inn gögn
   ↓
2. React State uppfært (debounced 500ms)
   ↓
3. Útreikningaföll keyrð (pure functions)
   ↓
4. CalculatorContext uppfært með nýjum útreikningum
   ↓
5. UI íhlutir endurteikna með nýjum niðurstöðum
   ↓
6. localStorage uppfært (automatic persistence)
```

**Samþætting við núverandi kerfishluta:**
- Sækir `actualHourlyWage` úr CalculatorContext
- Notar sömu UI íhluti (Input, Card, Button, Alert, etc.)
- Fylgir sömu localStorage snið og aðrir eiginleikar
- Deilir export/import virkni með app

### Samþættingarpunktar (Integration Points)

#### Innri samþættingar
- **CalculatorContext**: Sækir actualHourlyWage fyrir lífsorku útreikninga
- **localStorage**: Geymir gögnin undir lykli `peninganaedalifid_matkostnadur`
- **UI íhlutabókasafn**: Notar Card, Input, Button, Alert, Select, CurrencyInput
- **Utility föll**: formatCurrency, formatNumber, formatLifeEnergy

#### Ytri háðleikar
- Engir ytri API köll
- Engin þriðja aðila þjónustur
- Allir útreikningar client-side

### Tækniákvarðanir (Technology Stack)

#### Frontend Framework
- **React 18+** með TypeScript
- **Next.js** (App Router) fyrir routing
- **Tailwind CSS** fyrir stílun
- Ástæða: Fylgir núverandi app stack

#### Stöðustjórnun
- **React Context API** (CalculatorContext)
- **useState/useMemo/useCallback** fyrir local state
- **localStorage** fyrir viðvarandi geymslu
- Ástæða: Einfaldleiki, engin þörf fyrir flóknari lausnir (Redux/Zustand)

#### Útreikningar
- **Pure TypeScript föll** í `/lib/calculations/mealCost.ts`
- **Aðskilin frá UI** fyrir auðveldari prófun
- Ástæða: Testability, maintainability, fylgir núverandi mynstri

#### Gagnageymsla
- **localStorage** eingöngu
- **JSON serialization** fyrir export/import
- Ástæða: Privacy-first, offline-capable, no backend needed

#### Aðgengi
- **WCAG 2.1 AA** compliance
- **Semantic HTML** (labels, ARIA attributes)
- **Keyboard navigation** (Tab, Enter, Escape)
- Ástæða: Kröfur í requirements, bestu starfsvenjur

## Íhlutir og viðmót (Components and Interfaces)

### 1. MealCostCalculator (Aðalíhlutur)

**Tilgangur**: Aðal container component sem samræmir alla undirhluta og stjórnar heildarupplifun

**Ábyrgðarsvið**:
- Stjórna flipum/tabs milli innslátta og niðurstaðna
- Sækja og birta actualHourlyWage frá CalculatorContext
- Sýna viðvörun ef actualHourlyWage ekki skilgreint
- Layout fyrir farsíma vs borðtölvu

**Opinbert viðmót**:
```typescript
interface MealCostCalculatorProps {
  className?: string;
}

// Notar hooks úr context
const { mealCostData, updateMealCostData, results } = useCalculator();
```

**Háðleikar**:
- CalculatorContext fyrir actualHourlyWage og mealCostData
- EatingOutInputs component
- HomeCookingInputs component
- MealCostComparison component
- MealPresetSelector component
- UI components (Card, Alert, Tabs)

**Implementation Notes**:
- Notar Tab navigation pattern (svipað og SubscriptionList)
- Responsive layout: Stack vertically á mobile, side-by-side á desktop
- Sýnir Alert ef actualHourlyWage === 0

---

### 2. EatingOutInputs (Mat úti innsláttur)

**Tilgangur**: Safna öllum gögnum um mataræði utan heimilis með validation

**Ábyrgðarsvið**:
- Innsláttur fyrir máltíðir (morgun/hádegis/kvöld) og tíðni
- Innsláttur fyrir kaffi/drykkjavörur
- Innsláttur fyrir skyndibitamáltíðir
- Flýtival fyrir algeng íslensk verð
- Real-time validation og error messaging

**Opinbert viðmót**:
```typescript
interface EatingOutInputsProps {
  data: EatingOutData;
  onChange: (data: EatingOutData) => void;
}

interface EatingOutData {
  breakfastPerWeek: number;      // 0-21
  breakfastCost: number;          // > 0 kr
  lunchPerWeek: number;           // 0-21
  lunchCost: number;              // > 0 kr
  dinnerPerWeek: number;          // 0-21
  dinnerCost: number;             // > 0 kr
  coffeePerWeek: number;          // >= 0
  coffeeCost: number;             // > 0 kr
  fastFoodPerWeek: number;        // 0-21
  fastFoodCost: number;           // > 0 kr
}
```

**Háðleikar**:
- CurrencyInput fyrir krónutölur
- Input fyrir tölur (fjöldi máltíða)
- Select fyrir forstillt verð
- Card fyrir layout
- PRICE_PRESETS constant fyrir flýtival

**Implementation Notes**:
- Validation: meals 0-21, costs > 0
- Debounce 500ms fyrir onChange callback
- Icelandic labels og placeholders
- Accessibility: proper labels, ARIA attributes
- Forstillt gildi frá requirements (NS-1, NS-8)

---

### 3. HomeCookingInputs (Heimaeldun innsláttur)

**Tilgangur**: Safna gögnum um heimaeldunar kostnað og tíma

**Ábyrgðarsvið**:
- Innsláttur fyrir mánaðarlegt matvörukaup
- Innsláttur fyrir fjölda í heimili
- Innsláttur fyrir innkaupstíma (klst/viku)
- Innsláttur fyrir eldhústíma (klst/viku)
- Sýna reiknað gildi (kostnaður á mann)

**Opinbert viðmót**:
```typescript
interface HomeCookingInputsProps {
  data: HomeCookingData;
  onChange: (data: HomeCookingData) => void;
  actualHourlyWage: number;
}

interface HomeCookingData {
  monthlyGroceryCost: number;     // > 0 kr
  householdSize: number;          // >= 1
  shoppingHoursPerWeek: number;   // >= 0
  cookingHoursPerWeek: number;    // >= 0
}
```

**Háðleikar**:
- CurrencyInput fyrir krónutölur
- Input fyrir tölur
- Card fyrir layout
- formatCurrency fyrir display

**Implementation Notes**:
- Validation: grocery > 0, household >= 1, hours >= 0
- Debounce 500ms fyrir onChange
- Sýnir "Kostnaður á mann" sem read-only calculated field
- Sýnir tímakostnað calculation preview
- Icelandic number formatting

---

### 4. MealCostComparison (Samanburður)

**Tilgangur**: Sýna ítarlegan samanburð á milli að borða úti og heima með lífsorku og FV

**Ábyrgðarsvið**:
- Sundurliðun kostnaðar (mánaður/ár) fyrir báða valkosti
- Lífsorku samanburður
- Mismunur í krónum og lífsorku
- Framtíðarverðmæti sparnaðar (10/20/30 ár)
- Visual comparison (optional bar charts)

**Opinbert viðmót**:
```typescript
interface MealCostComparisonProps {
  eatingOutData: EatingOutData;
  homeCookingData: HomeCookingData;
  actualHourlyWage: number;
}

// Internally calculates:
interface ComparisonResults {
  eatingOut: MealCostSummary;
  homeCooking: MealCostSummary;
  difference: {
    monthly: number;           // kr (positive = home is cheaper)
    yearly: number;            // kr
    lifeEnergyMonthly: number; // hours
    lifeEnergyYearly: number;  // hours
    percentage: number;        // % difference
  };
  futureValue: {
    years10: number;
    years20: number;
    years30: number;
  };
}
```

**Háðleikar**:
- calculateMealCostSummary function
- calculateFutureValue function (reuse from subscriptions)
- formatCurrency, formatLifeEnergy, formatNumber
- Card for layout
- Alert for warnings/recommendations

**Implementation Notes**:
- Two-column layout (desktop), stacked (mobile)
- Clear visual hierarchy: Cost → Life Energy → Future Value
- Highlight savings in green, overspending in warning colors
- Show message if eating out cheaper due to high hourly wage
- Include breakdown tables (expandable on mobile)

---

### 5. MealPresetSelector (Atburðarása flýtival)

**Tilgangur**: Leyfa notanda að velja og bera saman forstilltar mataræðisáætlanir

**Ábyrgðarsvið**:
- Sýna lista af 5 forstilltum atburðarásir (NS-7)
- Fylla inn dæmigerð gildi þegar atburðarás valin
- Samanburðartafla sem sýnir allar atburðarásir hlið við hlið
- Leyfa custom breytingar eftir að velja atburðarás

**Opinbert viðmót**:
```typescript
interface MealPresetSelectorProps {
  currentData: MealCostData;
  onSelectPreset: (preset: MealScenarioPreset) => void;
  actualHourlyWage: number;
}

interface MealScenarioPreset {
  id: string;
  name: string;
  description: string;
  eatingOut: EatingOutData;
  homeCooking: HomeCookingData;
}
```

**Háðleikar**:
- MEAL_SCENARIO_PRESETS constant
- calculateMealCostSummary function
- Card, Button, Select UI components
- Comparison table component

**Implementation Notes**:
- 5 presets defined in constants (REQ NS-7):
  1. "Borða úti alla daga" (21 meals/week out)
  2. "Venjulegur vinnandi" (5 lunches/week out)
  3. "Hóflega heimaeldun" (home 5 days, out on weekends)
  4. "Mikil heimaeldun" (home 6 days, out 1 day)
  5. "100% heimaeldun" (all meals at home)
- Comparison table shows: Scenario | Monthly Cost | Life Energy | Savings | FV (20 years)
- Responsive table (horizontal scroll on mobile)

---

### 6. MealCostBreakdown (Sundurliðun)

**Tilgangur**: Sýna ítarlega sundurliðun á öllum kostnaðarþáttum

**Ábyrgðarsvið**:
- Sýna sundurliðun fyrir mat úti (morgun/hádegis/kvöld/kaffi/skyndi)
- Sýna sundurliðun fyrir heimaeldun (matvara/innkaup/eldun)
- Percentages og visual progress bars
- Life energy fyrir hvern lið

**Opinbert viðmót**:
```typescript
interface MealCostBreakdownProps {
  summary: MealCostSummary;
  type: 'eatingOut' | 'homeCooking';
  actualHourlyWage: number;
}

interface BreakdownItem {
  label: string;
  amount: number;      // kr
  lifeEnergy: number;  // hours
  percentage: number;  // % of total
}
```

**Háðleikar**:
- Card, Badge for UI
- formatCurrency, formatLifeEnergy
- Progress bar component (or CSS)

**Implementation Notes**:
- Collapsible on mobile (accordion style)
- Always expanded on desktop
- Color-coded by category
- Sort by amount (descending)

## Gagnalíkön (Data Models)

### Core Data Structures

Eftirfarandi TypeScript interfaces bætast við `/src/types/calculator.ts`:

#### MealCostData (Aðalgögn notanda)

```typescript
/**
 * Complete meal cost data for user
 * Stored in localStorage and managed by CalculatorContext
 */
export interface MealCostData {
  eatingOut: EatingOutData;
  homeCooking: HomeCookingData;
  lastUpdated: string; // ISO timestamp
}
```

**Properties**:
- `eatingOut`: EatingOutData - Gögn um mat utan heimilis
- `homeCooking`: HomeCookingData - Gögn um heimaeldun
- `lastUpdated`: string - Tímastimpill síðustu uppfærslu

**Validation Rules**:
- Bæði eatingOut og homeCooking verða að vera valid objects
- lastUpdated verður að vera valid ISO timestamp

**Storage**:
- Geymt í localStorage undir lykli `peninganaedalifid_matkostnadur`
- Part of larger StoredState object
- Auto-saved með 500ms debounce

---

#### EatingOutData (Mat úti gögn)

```typescript
/**
 * Data about eating out habits
 * All meal counts are per week (0-21)
 * All costs are in ISK
 */
export interface EatingOutData {
  // Breakfast
  breakfastPerWeek: number;      // 0-21 meals
  breakfastCost: number;          // ISK, > 0

  // Lunch
  lunchPerWeek: number;           // 0-21 meals
  lunchCost: number;              // ISK, > 0

  // Dinner
  dinnerPerWeek: number;          // 0-21 meals
  dinnerCost: number;             // ISK, > 0

  // Coffee/drinks
  coffeePerWeek: number;          // >= 0 purchases
  coffeeCost: number;             // ISK, > 0

  // Fast food
  fastFoodPerWeek: number;        // 0-21 meals
  fastFoodCost: number;           // ISK, > 0
}
```

**Properties**:
- `breakfastPerWeek`: number - Fjöldi morgunverða úti á viku (0-21)
- `breakfastCost`: number - Meðalverð morgunverðar í krónum (> 0)
- `lunchPerWeek`: number - Fjöldi hádegisverða úti á viku (0-21)
- `lunchCost`: number - Meðalverð hádegisverðar í krónum (> 0)
- `dinnerPerWeek`: number - Fjöldi kvöldverða úti á viku (0-21)
- `dinnerCost`: number - Meðalverð kvöldverðar í krónum (> 0)
- `coffeePerWeek`: number - Fjöldi kaffi/drykkja keyptra á viku (>= 0)
- `coffeeCost`: number - Meðalverð á kaffi/drykkjum í krónum (> 0)
- `fastFoodPerWeek`: number - Fjöldi skyndibitamáltíða á viku (0-21)
- `fastFoodCost`: number - Meðalverð skyndibitamáltíðar í krónum (> 0)

**Validation Rules**:
- Meal counts: >= 0 og <= 21 (max 3 meals × 7 days)
- Coffee count: >= 0 (no upper limit)
- All costs: > 0 (must be positive)
- Numbers only (no NaN or Infinity)

**Default Values**:
```typescript
const DEFAULT_EATING_OUT: EatingOutData = {
  breakfastPerWeek: 0,
  breakfastCost: 1500,
  lunchPerWeek: 5,
  lunchCost: 2500,
  dinnerPerWeek: 2,
  dinnerCost: 4000,
  coffeePerWeek: 5,
  coffeeCost: 650,
  fastFoodPerWeek: 1,
  fastFoodCost: 2000,
};
```

---

#### HomeCookingData (Heimaeldun gögn)

```typescript
/**
 * Data about home cooking costs and time
 * Monthly grocery cost, household size, and weekly hours
 */
export interface HomeCookingData {
  monthlyGroceryCost: number;     // ISK, > 0
  householdSize: number;          // >= 1 person
  shoppingHoursPerWeek: number;   // >= 0 hours
  cookingHoursPerWeek: number;    // >= 0 hours
}
```

**Properties**:
- `monthlyGroceryCost`: number - Mánaðarleg matvörukaup í krónum (> 0)
- `householdSize`: number - Fjöldi fólks í heimili (>= 1)
- `shoppingHoursPerWeek`: number - Klukkustundir í innkaupum á viku (>= 0)
- `cookingHoursPerWeek`: number - Klukkustundir í eldamennsku á viku (>= 0)

**Validation Rules**:
- monthlyGroceryCost: > 0 (must have some grocery cost)
- householdSize: >= 1 (at least one person)
- Hours: >= 0 (can be zero if not cooking)
- Numbers only (no NaN or Infinity)

**Default Values**:
```typescript
const DEFAULT_HOME_COOKING: HomeCookingData = {
  monthlyGroceryCost: 80000,
  householdSize: 2,
  shoppingHoursPerWeek: 2,
  cookingHoursPerWeek: 7,
};
```

---

#### MealCostSummary (Útreiknaðar niðurstöður)

```typescript
/**
 * Calculated summary for either eating out or home cooking
 * All monetary values in ISK
 * All time values in hours
 */
export interface MealCostSummary {
  // Costs
  weeklyTotal: number;            // ISK per week
  monthlyTotal: number;           // ISK per month (× 4.33)
  yearlyTotal: number;            // ISK per year (× 52)

  // Life energy
  lifeEnergyPerMonth: number;     // hours
  lifeEnergyPerYear: number;      // hours

  // Breakdown
  breakdown: MealCostBreakdownItem[];

  // Per person (only for home cooking)
  costPerPerson?: number;         // ISK per month
}
```

**Properties**:
- `weeklyTotal`: number - Heildarkostnaður á viku í krónum
- `monthlyTotal`: number - Heildarkostnaður á mánuði í krónum
- `yearlyTotal`: number - Heildarkostnaður á ári í krónum
- `lifeEnergyPerMonth`: number - Lífsorku klukkustundir á mánuði
- `lifeEnergyPerYear`: number - Lífsorku klukkustundir á ári
- `breakdown`: MealCostBreakdownItem[] - Sundurliðun kostnaðar
- `costPerPerson`: number (optional) - Kostnaður á mann (fyrir heimaeldun)

**Relationships**:
- Calculated from EatingOutData or HomeCookingData
- Uses actualHourlyWage from CalculatorContext
- Part of ComparisonResults

---

#### MealCostBreakdownItem (Sundurliðun einstakra liða)

```typescript
/**
 * Individual breakdown item for meal costs
 * Used to show detailed cost breakdown
 */
export interface MealCostBreakdownItem {
  category: string;               // 'breakfast' | 'lunch' | 'dinner' | 'coffee' | 'fastFood' | 'groceries' | 'shopping' | 'cooking'
  label: string;                  // Display label in Icelandic
  amount: number;                 // ISK (monthly)
  lifeEnergy: number;             // hours (monthly)
  percentage: number;             // % of total (0-100)
}
```

**Properties**:
- `category`: string - Category identifier
- `label`: string - Íslenskt heiti fyrir birtingu (t.d. "Morgunverðir")
- `amount`: number - Upphæð í krónum á mánuði
- `lifeEnergy`: number - Lífsorku klukkustundir á mánuði
- `percentage`: number - Hlutfall af heildarkostnaði (0-100)

**Validation Rules**:
- amount >= 0
- lifeEnergy >= 0
- percentage >= 0 and <= 100
- label must be non-empty string

---

#### ComparisonResults (Samanburður)

```typescript
/**
 * Complete comparison between eating out and home cooking
 * Shows difference and future value projections
 */
export interface ComparisonResults {
  eatingOut: MealCostSummary;
  homeCooking: MealCostSummary;

  difference: {
    monthly: number;              // ISK (positive = home is cheaper)
    yearly: number;               // ISK
    lifeEnergyMonthly: number;    // hours
    lifeEnergyYearly: number;     // hours
    percentage: number;           // % difference
  };

  futureValue: {
    years10: number;              // ISK at 7% return
    years20: number;              // ISK at 7% return
    years30: number;              // ISK at 7% return
  };

  recommendation: string;          // Text recommendation in Icelandic
}
```

**Properties**:
- `eatingOut`: MealCostSummary - Summary fyrir mat úti
- `homeCooking`: MealCostSummary - Summary fyrir heimaeldun
- `difference`: object - Munur á milli valkosta
  - `monthly`: number - Mánaðarlegur munur í krónum (jákvætt = heimaeldun ódýrari)
  - `yearly`: number - Árlegur munur í krónum
  - `lifeEnergyMonthly`: number - Lífsorku munur á mánuði
  - `lifeEnergyYearly`: number - Lífsorku munur á ári
  - `percentage`: number - Hlutfallslegur munur
- `futureValue`: object - Framtíðarverðmæti ef munur fjárfestur
  - `years10`: number - Verðmæti eftir 10 ár við 7% ávöxtun
  - `years20`: number - Verðmæti eftir 20 ár við 7% ávöxtun
  - `years30`: number - Verðmæti eftir 30 ár við 7% ávöxtun
- `recommendation`: string - Íslensk ráðlegging byggð á niðurstöðum

---

#### MealScenarioPreset (Forstillt atburðarás)

```typescript
/**
 * Predefined meal scenario for quick comparison
 * 5 scenarios from requirements (NS-7)
 */
export interface MealScenarioPreset {
  id: string;
  name: string;                   // Icelandic name
  description: string;            // Icelandic description
  eatingOut: EatingOutData;
  homeCooking: HomeCookingData;
}
```

**Properties**:
- `id`: string - Unique identifier (e.g., 'all-out', 'typical-worker')
- `name`: string - Íslenskt heiti (t.d. "Borða úti alla daga")
- `description`: string - Íslensk lýsing á atburðarás
- `eatingOut`: EatingOutData - Eating out configuration
- `homeCooking`: HomeCookingData - Home cooking configuration

**Validation Rules**:
- id must be unique
- name and description must be non-empty
- eatingOut and homeCooking must be valid

**Storage**:
- Defined as constants (not user-editable)
- 5 presets from requirements NS-7

---

### Constants and Presets

#### Price Presets (Verðflýtival)

```typescript
/**
 * Common meal prices in Iceland (2026, Reykjavík area)
 * Used for quick selection in UI
 */
export const MEAL_PRICE_PRESETS = {
  breakfast: [
    { label: 'Kaffihús morgunverður', value: 1500 },
    { label: 'Veitingahús morgunverður', value: 2500 },
    { label: 'Hótel morgunhlaðborð', value: 3500 },
  ],
  lunch: [
    { label: 'Skyndibitastaður', value: 1800 },
    { label: 'Góður skyndibitastaður', value: 2500 },
    { label: 'Veitingahús', value: 3500 },
    { label: 'Góður veitingahús', value: 4500 },
  ],
  dinner: [
    { label: 'Skyndibitastaður', value: 2000 },
    { label: 'Venjulegur veitingahús', value: 4000 },
    { label: 'Góður veitingahús', value: 6000 },
    { label: 'Fínir veitingahús', value: 10000 },
  ],
  coffee: [
    { label: 'Bensínstöð kaffi', value: 400 },
    { label: 'Kaffihús espresso', value: 650 },
    { label: 'Kaffihús specialty', value: 1000 },
  ],
  fastFood: [
    { label: 'Venjulegur skyndibitastaður', value: 2000 },
  ],
} as const;
```

#### Scenario Presets (Atburðarásir)

```typescript
/**
 * 5 predefined meal scenarios (from NS-7)
 */
export const MEAL_SCENARIO_PRESETS: MealScenarioPreset[] = [
  {
    id: 'all-out',
    name: 'Borða úti alla daga',
    description: '21 máltíð úti á viku, ekkert eldað heima',
    eatingOut: {
      breakfastPerWeek: 7,
      breakfastCost: 1500,
      lunchPerWeek: 7,
      lunchCost: 2500,
      dinnerPerWeek: 7,
      dinnerCost: 4000,
      coffeePerWeek: 14,
      coffeeCost: 650,
      fastFoodPerWeek: 0,
      fastFoodCost: 2000,
    },
    homeCooking: {
      monthlyGroceryCost: 20000, // Minimal grocery
      householdSize: 1,
      shoppingHoursPerWeek: 0.5,
      cookingHoursPerWeek: 0,
    },
  },
  {
    id: 'typical-worker',
    name: 'Venjulegur vinnandi',
    description: 'Hádegisverður úti 5 daga/viku, annað heima',
    eatingOut: {
      breakfastPerWeek: 0,
      breakfastCost: 1500,
      lunchPerWeek: 5,
      lunchCost: 2500,
      dinnerPerWeek: 1,
      dinnerCost: 4000,
      coffeePerWeek: 5,
      coffeeCost: 650,
      fastFoodPerWeek: 1,
      fastFoodCost: 2000,
    },
    homeCooking: {
      monthlyGroceryCost: 60000,
      householdSize: 2,
      shoppingHoursPerWeek: 2,
      cookingHoursPerWeek: 5,
    },
  },
  {
    id: 'moderate-home',
    name: 'Hóflega heimaeldun',
    description: 'Elda heima 5 daga/viku, úti um helgar',
    eatingOut: {
      breakfastPerWeek: 1,
      breakfastCost: 1500,
      lunchPerWeek: 2,
      lunchCost: 2500,
      dinnerPerWeek: 2,
      dinnerCost: 4000,
      coffeePerWeek: 3,
      coffeeCost: 650,
      fastFoodPerWeek: 1,
      fastFoodCost: 2000,
    },
    homeCooking: {
      monthlyGroceryCost: 70000,
      householdSize: 2,
      shoppingHoursPerWeek: 2,
      cookingHoursPerWeek: 6,
    },
  },
  {
    id: 'mostly-home',
    name: 'Mikil heimaeldun',
    description: 'Elda heima 6 daga/viku, úti 1 dag',
    eatingOut: {
      breakfastPerWeek: 0,
      breakfastCost: 1500,
      lunchPerWeek: 1,
      lunchCost: 2500,
      dinnerPerWeek: 1,
      dinnerCost: 4000,
      coffeePerWeek: 2,
      coffeeCost: 650,
      fastFoodPerWeek: 0,
      fastFoodCost: 2000,
    },
    homeCooking: {
      monthlyGroceryCost: 80000,
      householdSize: 2,
      shoppingHoursPerWeek: 2.5,
      cookingHoursPerWeek: 7,
    },
  },
  {
    id: 'all-home',
    name: '100% heimaeldun',
    description: 'Allar máltíðir elda heima',
    eatingOut: {
      breakfastPerWeek: 0,
      breakfastCost: 1500,
      lunchPerWeek: 0,
      lunchCost: 2500,
      dinnerPerWeek: 0,
      dinnerCost: 4000,
      coffeePerWeek: 0,
      coffeeCost: 650,
      fastFoodPerWeek: 0,
      fastFoodCost: 2000,
    },
    homeCooking: {
      monthlyGroceryCost: 90000,
      householdSize: 2,
      shoppingHoursPerWeek: 3,
      cookingHoursPerWeek: 8,
    },
  },
];
```

---

### CalculatorContext Integration

Bæta við eftirfarandi í CalculatorContext interface:

```typescript
interface CalculatorContextType {
  // ... existing fields ...

  // Meal cost data
  mealCostData: MealCostData;
  updateMealCostData: (data: Partial<MealCostData>) => void;
  updateEatingOut: (data: Partial<EatingOutData>) => void;
  updateHomeCooking: (data: Partial<HomeCookingData>) => void;

  // Meal cost calculations (memoized)
  mealCostSummary: {
    eatingOut: MealCostSummary | null;
    homeCooking: MealCostSummary | null;
    comparison: ComparisonResults | null;
  };
}
```

---

### StoredState Update

Uppfæra StoredState til að innihalda mealCostData:

```typescript
export interface StoredState {
  version: number;
  currentInputs: CalculatorInputs;
  scenarios: Scenario[];
  subscriptions: Subscription[];
  mealCostData: MealCostData;  // NEW
  lastUpdated: string;
}
```

## Útreikningalógík (Calculation Logic)

Öll calculation logic verður í pure TypeScript föllum í `/src/lib/calculations/mealCost.ts`.

### Core Calculation Functions

#### 1. calculateEatingOutWeeklyCost

```typescript
/**
 * Calculate total weekly cost of eating out
 * Sums all meal categories and beverages
 */
export function calculateEatingOutWeeklyCost(data: EatingOutData): number {
  return (
    data.breakfastPerWeek * data.breakfastCost +
    data.lunchPerWeek * data.lunchCost +
    data.dinnerPerWeek * data.dinnerCost +
    data.coffeePerWeek * data.coffeeCost +
    data.fastFoodPerWeek * data.fastFoodCost
  );
}
```

**Formula**: `Σ(fjöldi × verð)` fyrir alla flokka

**Input**: EatingOutData
**Output**: Vikukostnaður í ISK
**Edge cases**: Öll gildi verða að vera >= 0

---

#### 2. calculateHomeCookingWeeklyCost

```typescript
/**
 * Calculate total weekly cost of home cooking
 * Includes groceries + time cost (shopping + cooking)
 */
export function calculateHomeCookingWeeklyCost(
  data: HomeCookingData,
  actualHourlyWage: number
): number {
  // Weekly grocery cost (monthly / 4.33)
  const weeklyGroceryCost = data.monthlyGroceryCost / 4.33;

  // Time cost
  const shoppingTimeCost = data.shoppingHoursPerWeek * actualHourlyWage;
  const cookingTimeCost = data.cookingHoursPerWeek * actualHourlyWage;

  return weeklyGroceryCost + shoppingTimeCost + cookingTimeCost;
}
```

**Formula**:
```
Vikukostnaður = (Matvörukaup / 4.33) + (Innkaupstími × Tímakaup) + (Eldhústími × Tímakaup)
```

**Input**: HomeCookingData, actualHourlyWage
**Output**: Vikukostnaður í ISK
**Constants**:
- `WEEKS_PER_MONTH = 4.33` (52 weeks / 12 months)

---

#### 3. calculateMealCostSummary

```typescript
/**
 * Calculate complete summary for eating out OR home cooking
 * Includes costs, life energy, and breakdown
 */
export function calculateMealCostSummary(
  data: EatingOutData | HomeCookingData,
  type: 'eatingOut' | 'homeCooking',
  actualHourlyWage: number
): MealCostSummary {
  // Calculate weekly cost
  const weeklyTotal = type === 'eatingOut'
    ? calculateEatingOutWeeklyCost(data as EatingOutData)
    : calculateHomeCookingWeeklyCost(data as HomeCookingData, actualHourlyWage);

  // Convert to monthly and yearly
  const monthlyTotal = weeklyTotal * WEEKS_PER_MONTH; // 4.33
  const yearlyTotal = weeklyTotal * 52;

  // Calculate life energy
  const lifeEnergyPerMonth = dollarsToLifeEnergy(monthlyTotal, actualHourlyWage);
  const lifeEnergyPerYear = dollarsToLifeEnergy(yearlyTotal, actualHourlyWage);

  // Generate breakdown
  const breakdown = type === 'eatingOut'
    ? generateEatingOutBreakdown(data as EatingOutData, actualHourlyWage)
    : generateHomeCookingBreakdown(data as HomeCookingData, actualHourlyWage);

  // Calculate cost per person (home cooking only)
  const costPerPerson = type === 'homeCooking'
    ? monthlyTotal / (data as HomeCookingData).householdSize
    : undefined;

  return {
    weeklyTotal,
    monthlyTotal,
    yearlyTotal,
    lifeEnergyPerMonth,
    lifeEnergyPerYear,
    breakdown,
    costPerPerson,
  };
}
```

**Constants**:
- `WEEKS_PER_MONTH = 4.33` (average weeks per month)
- `WEEKS_PER_YEAR = 52`

---

#### 4. generateEatingOutBreakdown

```typescript
/**
 * Generate detailed breakdown for eating out costs
 * One item per meal category
 */
export function generateEatingOutBreakdown(
  data: EatingOutData,
  actualHourlyWage: number
): MealCostBreakdownItem[] {
  const weeklyTotal = calculateEatingOutWeeklyCost(data);
  const monthlyTotal = weeklyTotal * WEEKS_PER_MONTH;

  const items: MealCostBreakdownItem[] = [];

  // Breakfast
  if (data.breakfastPerWeek > 0) {
    const amount = data.breakfastPerWeek * data.breakfastCost * WEEKS_PER_MONTH;
    items.push({
      category: 'breakfast',
      label: 'Morgunverðir',
      amount,
      lifeEnergy: dollarsToLifeEnergy(amount, actualHourlyWage),
      percentage: (amount / monthlyTotal) * 100,
    });
  }

  // Lunch
  if (data.lunchPerWeek > 0) {
    const amount = data.lunchPerWeek * data.lunchCost * WEEKS_PER_MONTH;
    items.push({
      category: 'lunch',
      label: 'Hádegisverðir',
      amount,
      lifeEnergy: dollarsToLifeEnergy(amount, actualHourlyWage),
      percentage: (amount / monthlyTotal) * 100,
    });
  }

  // Dinner, Coffee, FastFood (similar pattern)
  // ...

  return items.sort((a, b) => b.amount - a.amount); // Sort by amount descending
}
```

---

#### 5. generateHomeCookingBreakdown

```typescript
/**
 * Generate detailed breakdown for home cooking costs
 * Three items: groceries, shopping time, cooking time
 */
export function generateHomeCookingBreakdown(
  data: HomeCookingData,
  actualHourlyWage: number
): MealCostBreakdownItem[] {
  const groceryCost = data.monthlyGroceryCost;
  const shoppingCost = data.shoppingHoursPerWeek * actualHourlyWage * WEEKS_PER_MONTH;
  const cookingCost = data.cookingHoursPerWeek * actualHourlyWage * WEEKS_PER_MONTH;
  const total = groceryCost + shoppingCost + cookingCost;

  return [
    {
      category: 'groceries',
      label: 'Matvörukostnaður',
      amount: groceryCost,
      lifeEnergy: dollarsToLifeEnergy(groceryCost, actualHourlyWage),
      percentage: (groceryCost / total) * 100,
    },
    {
      category: 'shopping',
      label: 'Tímakostnaður innkaupa',
      amount: shoppingCost,
      lifeEnergy: data.shoppingHoursPerWeek * WEEKS_PER_MONTH,
      percentage: (shoppingCost / total) * 100,
    },
    {
      category: 'cooking',
      label: 'Tímakostnaður eldunar',
      amount: cookingCost,
      lifeEnergy: data.cookingHoursPerWeek * WEEKS_PER_MONTH,
      percentage: (cookingCost / total) * 100,
    },
  ].sort((a, b) => b.amount - a.amount);
}
```

---

#### 6. compareM ealCosts

```typescript
/**
 * Compare eating out vs home cooking
 * Calculate difference and future value projections
 */
export function compareMealCosts(
  eatingOutData: EatingOutData,
  homeCookingData: HomeCookingData,
  actualHourlyWage: number
): ComparisonResults {
  const eatingOut = calculateMealCostSummary(eatingOutData, 'eatingOut', actualHourlyWage);
  const homeCooking = calculateMealCostSummary(homeCookingData, 'homeCooking', actualHourlyWage);

  // Calculate differences (positive = home cooking is cheaper)
  const monthlyDiff = eatingOut.monthlyTotal - homeCooking.monthlyTotal;
  const yearlyDiff = eatingOut.yearlyTotal - homeCooking.yearlyTotal;
  const lifeEnergyMonthlyDiff = eatingOut.lifeEnergyPerMonth - homeCooking.lifeEnergyPerMonth;
  const lifeEnergyYearlyDiff = eatingOut.lifeEnergyPerYear - homeCooking.lifeEnergyPerYear;

  const percentage = eatingOut.monthlyTotal > 0
    ? (monthlyDiff / eatingOut.monthlyTotal) * 100
    : 0;

  // Calculate future value if savings invested
  const monthlySavings = Math.abs(monthlyDiff);
  const futureValue = {
    years10: calculateFutureValue(monthlySavings, 0.07, 10),
    years20: calculateFutureValue(monthlySavings, 0.07, 20),
    years30: calculateFutureValue(monthlySavings, 0.07, 30),
  };

  // Generate recommendation
  const recommendation = generateRecommendation(monthlyDiff, percentage);

  return {
    eatingOut,
    homeCooking,
    difference: {
      monthly: monthlyDiff,
      yearly: yearlyDiff,
      lifeEnergyMonthly: lifeEnergyMonthlyDiff,
      lifeEnergyYearly: lifeEnergyYearlyDiff,
      percentage,
    },
    futureValue,
    recommendation,
  };
}
```

**Formula fyrir mismun**:
```
Munur = Mat úti - Heimaeldun
Jákvætt = Heimaeldun sparar peninga
Neikvætt = Mat úti sparar peninga (vegna hás tímakaups)
```

---

#### 7. generateRecommendation

```typescript
/**
 * Generate Icelandic recommendation based on comparison
 */
function generateRecommendation(monthlyDiff: number, percentage: number): string {
  if (monthlyDiff > 10000) {
    return `Heimaeldun sparar ${formatCurrency(monthlyDiff)} á mánuði (${percentage.toFixed(1)}%). Þetta er verulegur sparnaður!`;
  } else if (monthlyDiff > 0) {
    return `Heimaeldun sparar ${formatCurrency(monthlyDiff)} á mánuði. Lítill sparnaður en samt eitthvað.`;
  } else if (monthlyDiff < -5000) {
    return `Með þínu háa tímakaupi er ódýrara að borða úti. Þú sparar ${formatCurrency(Math.abs(monthlyDiff))} á mánuði með því að borða úti.`;
  } else {
    return `Kostnaður er svipaður. Veldu það sem hentar þér best.`;
  }
}
```

---

### Calculation Constants

```typescript
// Time constants
export const WEEKS_PER_MONTH = 4.33; // 52 weeks / 12 months
export const WEEKS_PER_YEAR = 52;
export const HOURS_PER_WORK_DAY = 8;

// Future value constants
export const DEFAULT_ANNUAL_RETURN = 0.07; // 7%
export const FV_PROJECTION_YEARS = [10, 20, 30];
```

---

### Reusing Existing Functions

The following functions already exist and will be reused:

```typescript
// From /lib/calculations/lifeEnergy.ts
import { dollarsToLifeEnergy, formatLifeEnergy } from '@/lib/calculations/lifeEnergy';

// From /lib/calculations/subscriptions.ts
import { calculateFutureValue } from '@/lib/calculations/subscriptions';

// From /lib/utils.ts
import { formatCurrency, formatNumber } from '@/lib/utils';
```

---

### Calculation File Structure

```
/src/lib/calculations/mealCost.ts
├── Constants
│   ├── WEEKS_PER_MONTH
│   ├── WEEKS_PER_YEAR
│   └── DEFAULT_ANNUAL_RETURN
├── Core calculations
│   ├── calculateEatingOutWeeklyCost()
│   ├── calculateHomeCookingWeeklyCost()
│   └── calculateMealCostSummary()
├── Breakdown generation
│   ├── generateEatingOutBreakdown()
│   └── generateHomeCookingBreakdown()
├── Comparison
│   ├── compareMealCosts()
│   └── generateRecommendation()
└── Helpers
    ├── clampValue()
    └── safeNumber()
```

## Villustjórnun (Error Handling)

### Villuflokkar (Error Categories)

#### 1. Innsláttar villur (Input Validation Errors)

**Tegund**: User input validation
**Viðbrögð**: Sýna villa við viðkomandi reit, hindra ekki aðra virkni
**Notandi sér**: Rauð texti undir reit með villuskilaboðum
**Logging**: Engin logging (expected user errors)
**Bati**: Notandi leiðréttir innsláttur

**Dæmi**:
- Fjöldi máltíða < 0 eða > 21: "Fjöldi máltíða verður að vera á milli 0 og 21"
- Verð <= 0: "Verð verður að vera hærra en 0 kr"
- Fjöldi í heimili < 1: "Að minnsta kosti 1 manneskja verður að vera í heimili"
- Tími < 0: "Tími getur ekki verið neikvæður"
- NaN eða Infinity: "Vinsamlegast sláðu inn gilda tölu"

**Meðhöndlun í kóða**:
```typescript
function validateEatingOutData(data: EatingOutData): ValidationResult {
  const errors: Record<string, string> = {};

  // Validate meal counts (0-21)
  if (data.breakfastPerWeek < 0 || data.breakfastPerWeek > 21) {
    errors.breakfastPerWeek = 'Fjöldi máltíða verður að vera á milli 0 og 21';
  }

  // Validate costs (> 0)
  if (data.breakfastCost <= 0 || !isFinite(data.breakfastCost)) {
    errors.breakfastCost = 'Verð verður að vera hærra en 0 kr';
  }

  // ... repeat for all fields

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
```

---

#### 2. Vantar raunverulegt tímakaup (Missing Actual Hourly Wage)

**Tegund**: Dependency missing
**Viðbrögð**: Sýna viðvörun, gera lífsorku útreikninga óvirka
**Notandi sér**: Alert box efst á síðu með link til aðalreiknivélar
**Logging**: Engin
**Bati**: Notandi fylla út aðalreiknivél fyrst

**Skillaboð**:
```
⚠️ Vinsamlegast fylltu út Raunverulegt Tímakaup reiknivélina fyrst.

Matkostnaðarmælir þarf raunverulegt tímakaup þitt til að reikna út
lífsorku kostnað máltíða.

[Fara í reiknivél]
```

**Meðhöndlun**:
```typescript
function MealCostCalculator() {
  const { results } = useCalculator();
  const actualHourlyWage = results?.actualHourlyWage ?? 0;

  if (actualHourlyWage === 0) {
    return (
      <Alert variant="warning">
        <p>Vinsamlegast fylltu út Raunverulegt Tímakaup reiknivélina fyrst.</p>
        <Link href="/calculator">Fara í reiknivél</Link>
      </Alert>
    );
  }

  // ... rest of component
}
```

---

#### 3. localStorage villur (Storage Errors)

**Tegund**: Storage failures
**Viðbrögð**: Sýna villuskilaboð, leyfa áfram notkun (án vista)
**Notandi sér**: Toast notification með villu
**Logging**: console.error með stack trace
**Bati**: Bjóða upp á export til að vista gögn utan vafra

**Dæmi**:
- localStorage fullt: "Geymslurými fullt. Ertu viss um að þú viljir eyða eldri gögnum?"
- localStorage óvirkt: "Geymsla er óvirk í vafranum þínum. Gögnin þín verða ekki vistuð."
- Serialization villa: "Gat ekki vistað gögn. Vinsamlegast reyndu aftur."

**Meðhöndlun**:
```typescript
function saveMealCostData(data: MealCostData): void {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(MEAL_COST_STORAGE_KEY, serialized);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      toast.error('Geymslurými fullt. Vinsamlegast eyddu eldri gögnum.');
    } else if (error instanceof DOMException && error.name === 'SecurityError') {
      toast.warning('Geymsla er óvirk. Gögnin verða ekki vistuð.');
    } else {
      console.error('Failed to save meal cost data:', error);
      toast.error('Gat ekki vistað gögn. Vinsamlegast reyndu aftur.');
    }
  }
}
```

---

#### 4. Útreikningavillur (Calculation Errors)

**Tegund**: Math errors (edge cases)
**Viðbrögð**: Fallback til 0 eða null, sýna viðvörun
**Notandi sér**: "Ekki hægt að reikna" með explanation
**Logging**: console.warn með input gildum
**Bati**: Automatic fallback values

**Edge cases**:
- Division by zero: Return 0
- Negative values í squareroot: Return 0
- Infinity results: Clamp to MAX_SAFE_INTEGER
- NaN results: Return 0

**Meðhöndlun**:
```typescript
function calculateMealCostSummary(
  data: EatingOutData | HomeCookingData,
  actualHourlyWage: number
): MealCostSummary {
  try {
    // Perform calculations
    const weeklyTotal = calculateWeeklyTotal(data);

    // Protect against edge cases
    if (!isFinite(weeklyTotal) || weeklyTotal < 0) {
      console.warn('Invalid weekly total:', weeklyTotal);
      return getEmptySummary();
    }

    // ... rest of calculations with guards

  } catch (error) {
    console.error('Calculation error:', error, { data, actualHourlyWage });
    return getEmptySummary();
  }
}

function getEmptySummary(): MealCostSummary {
  return {
    weeklyTotal: 0,
    monthlyTotal: 0,
    yearlyTotal: 0,
    lifeEnergyPerMonth: 0,
    lifeEnergyPerYear: 0,
    breakdown: [],
  };
}
```

---

#### 5. Import/Export villur (Data Import/Export Errors)

**Tegund**: File operations
**Viðbrögð**: Sýna villuskilaboð, hafna import
**Notandi sér**: Toast með ástæðu
**Logging**: console.error með file content (truncated)
**Bati**: Notandi prófar aftur með réttum file

**Dæmi**:
- Invalid JSON: "Skráin er ekki gild JSON skrá"
- Wrong schema: "Skráin inniheldur ekki gild gögn"
- File too large: "Skráin er of stór"
- Wrong file type: "Vinsamlegast veldu .json skrá"

**Meðhöndlun**:
```typescript
async function importMealCostData(file: File): Promise<void> {
  // Validate file type
  if (!file.name.endsWith('.json')) {
    throw new Error('Vinsamlegast veldu .json skrá');
  }

  // Validate file size (max 1MB)
  if (file.size > 1024 * 1024) {
    throw new Error('Skráin er of stór');
  }

  const text = await file.text();

  // Validate JSON
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('Skráin er ekki gild JSON skrá');
  }

  // Validate schema
  if (!isMealCostData(parsed)) {
    throw new Error('Skráin inniheldur ekki gild gögn');
  }

  // Import successful
  updateMealCostData(parsed);
  toast.success('Gögn innflutt með góðum árangri');
}
```

---

### Validation Strategy

#### Client-side validation (Real-time)
- Keyrir á hverri keystroke (debounced 300ms)
- Sýnir villur við reit strax
- Leyfir notanda að halda áfram (soft errors)
- Ekki framkvæma útreikninga með ógild gögn

#### Pre-save validation
- Keyrir áður en gögn vistuð í localStorage
- Leiðréttir minor issues (trim whitespace, clamp values)
- Logs validation failures

#### Type guards
```typescript
function isEatingOutData(value: unknown): value is EatingOutData {
  if (typeof value !== 'object' || value === null) return false;

  const obj = value as Record<string, unknown>;

  return (
    typeof obj.breakfastPerWeek === 'number' &&
    typeof obj.breakfastCost === 'number' &&
    typeof obj.lunchPerWeek === 'number' &&
    typeof obj.lunchCost === 'number' &&
    typeof obj.dinnerPerWeek === 'number' &&
    typeof obj.dinnerCost === 'number' &&
    typeof obj.coffeePerWeek === 'number' &&
    typeof obj.coffeeCost === 'number' &&
    typeof obj.fastFoodPerWeek === 'number' &&
    typeof obj.fastFoodCost === 'number'
  );
}
```

---

### Error Recovery Mechanisms

#### Graceful Degradation
- Ef actualHourlyWage vantar: Sýna bara krónutölur (ekki lífsorku)
- Ef localStorage fails: Virka í "session-only" mode
- Ef útreikningar faila: Sýna síðustu gildu niðurstöður

#### Auto-correction
- Clamp gildi innan valid range (e.g., meals 0-21)
- Round decimals til reasonable precision
- Convert empty string to 0

#### User Communication
- Clear error messages í íslensku
- Actionable instructions (hvað á að gera)
- Links til help/documentation ef við á

---

### Error Messages (Icelandic)

```typescript
export const ERROR_MESSAGES = {
  // Input validation
  MEALS_OUT_OF_RANGE: 'Fjöldi máltíða verður að vera á milli 0 og 21',
  COST_POSITIVE: 'Verð verður að vera hærra en 0 kr',
  HOUSEHOLD_MIN_ONE: 'Að minnsta kosti 1 manneskja verður að vera í heimili',
  TIME_NEGATIVE: 'Tími getur ekki verið neikvæður',
  INVALID_NUMBER: 'Vinsamlegast sláðu inn gilda tölu',

  // Missing data
  MISSING_WAGE: 'Vinsamlegast fylltu út Raunverulegt Tímakaup reiknivélina fyrst',

  // Storage
  STORAGE_QUOTA: 'Geymslurými fullt. Vinsamlegast eyddu eldri gögnum.',
  STORAGE_DISABLED: 'Geymsla er óvirk. Gögnin verða ekki vistuð.',
  STORAGE_GENERIC: 'Gat ekki vistað gögn. Vinsamlegast reyndu aftur.',

  // Import/Export
  IMPORT_INVALID_JSON: 'Skráin er ekki gild JSON skrá',
  IMPORT_INVALID_SCHEMA: 'Skráin inniheldur ekki gild gögn',
  IMPORT_FILE_TOO_LARGE: 'Skráin er of stór',
  IMPORT_WRONG_TYPE: 'Vinsamlegast veldu .json skrá',
  EXPORT_FAILED: 'Gat ekki flutt út gögn',

  // Calculations
  CALC_ERROR: 'Villa kom upp við útreikninga',
} as const;
```

## Prófunarstefna (Testing Strategy)

### Yfirlit

Testing strategy fylgir existing patterns í codebase með áherslu á:
- **Unit tests** fyrir calculations (pure functions)
- **Component tests** fyrir React components
- **Integration tests** fyrir CalculatorContext integration
- **Accessibility tests** fyrir WCAG compliance
- **Manual testing** fyrir UX og responsive design

### Unit Testing (Calculations)

#### Test Framework
- **Vitest** (same as existing codebase)
- **Location**: `/src/lib/calculations/__tests__/mealCost.test.ts`

#### Coverage Goals
- **95%+ coverage** fyrir calculation functions
- All edge cases covered
- All formula paths tested

#### Test Cases for calculateEatingOutWeeklyCost

```typescript
describe('calculateEatingOutWeeklyCost', () => {
  it('should calculate total weekly cost correctly', () => {
    const data: EatingOutData = {
      breakfastPerWeek: 5,
      breakfastCost: 1500,
      lunchPerWeek: 5,
      lunchCost: 2500,
      dinnerPerWeek: 2,
      dinnerCost: 4000,
      coffeePerWeek: 10,
      coffeeCost: 650,
      fastFoodPerWeek: 1,
      fastFoodCost: 2000,
    };

    const result = calculateEatingOutWeeklyCost(data);

    // 5*1500 + 5*2500 + 2*4000 + 10*650 + 1*2000 = 36000
    expect(result).toBe(36000);
  });

  it('should return 0 for all zero meals', () => {
    const data: EatingOutData = {
      breakfastPerWeek: 0,
      breakfastCost: 1500,
      lunchPerWeek: 0,
      lunchCost: 2500,
      dinnerPerWeek: 0,
      dinnerCost: 4000,
      coffeePerWeek: 0,
      coffeeCost: 650,
      fastFoodPerWeek: 0,
      fastFoodCost: 2000,
    };

    expect(calculateEatingOutWeeklyCost(data)).toBe(0);
  });

  it('should handle maximum values (21 meals each)', () => {
    const data: EatingOutData = {
      breakfastPerWeek: 21,
      breakfastCost: 3500,
      lunchPerWeek: 21,
      lunchCost: 4500,
      dinnerPerWeek: 21,
      dinnerCost: 10000,
      coffeePerWeek: 50,
      coffeeCost: 1000,
      fastFoodPerWeek: 21,
      fastFoodCost: 2000,
    };

    const result = calculateEatingOutWeeklyCost(data);
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(Number.MAX_SAFE_INTEGER);
  });
});
```

#### Test Cases for calculateHomeCookingWeeklyCost

```typescript
describe('calculateHomeCookingWeeklyCost', () => {
  it('should include grocery and time costs', () => {
    const data: HomeCookingData = {
      monthlyGroceryCost: 80000,
      householdSize: 2,
      shoppingHoursPerWeek: 2,
      cookingHoursPerWeek: 7,
    };
    const actualHourlyWage = 5000;

    const result = calculateHomeCookingWeeklyCost(data, actualHourlyWage);

    // (80000 / 4.33) + (2 * 5000) + (7 * 5000) = 18475.17 + 10000 + 35000 = 63475.17
    expect(result).toBeCloseTo(63475.17, 2);
  });

  it('should return only grocery cost when time is zero', () => {
    const data: HomeCookingData = {
      monthlyGroceryCost: 80000,
      householdSize: 2,
      shoppingHoursPerWeek: 0,
      cookingHoursPerWeek: 0,
    };
    const actualHourlyWage = 5000;

    const result = calculateHomeCookingWeeklyCost(data, actualHourlyWage);

    // Only grocery: 80000 / 4.33 = 18475.17
    expect(result).toBeCloseTo(18475.17, 2);
  });

  it('should handle zero hourly wage gracefully', () => {
    const data: HomeCookingData = {
      monthlyGroceryCost: 80000,
      householdSize: 2,
      shoppingHoursPerWeek: 2,
      cookingHoursPerWeek: 7,
    };
    const actualHourlyWage = 0;

    const result = calculateHomeCookingWeeklyCost(data, actualHourlyWage);

    // Only grocery cost when wage is 0
    expect(result).toBeCloseTo(18475.17, 2);
  });
});
```

#### Test Cases for compareMealCosts

```typescript
describe('compareMealCosts', () => {
  it('should show home cooking as cheaper', () => {
    const eatingOut: EatingOutData = {
      breakfastPerWeek: 5,
      breakfastCost: 1500,
      lunchPerWeek: 5,
      lunchCost: 2500,
      dinnerPerWeek: 2,
      dinnerCost: 4000,
      coffeePerWeek: 10,
      coffeeCost: 650,
      fastFoodPerWeek: 1,
      fastFoodCost: 2000,
    };

    const homeCooking: HomeCookingData = {
      monthlyGroceryCost: 60000,
      householdSize: 2,
      shoppingHoursPerWeek: 2,
      cookingHoursPerWeek: 5,
    };

    const actualHourlyWage = 3000;

    const result = compareMealCosts(eatingOut, homeCooking, actualHourlyWage);

    expect(result.difference.monthly).toBeGreaterThan(0); // Positive = home is cheaper
    expect(result.recommendation).toContain('Heimaeldun sparar');
  });

  it('should show eating out as cheaper for high hourly wage', () => {
    const eatingOut: EatingOutData = {
      // Minimal eating out
      breakfastPerWeek: 0,
      breakfastCost: 1500,
      lunchPerWeek: 1,
      lunchCost: 2500,
      dinnerPerWeek: 0,
      dinnerCost: 4000,
      coffeePerWeek: 0,
      coffeeCost: 650,
      fastFoodPerWeek: 0,
      fastFoodCost: 2000,
    };

    const homeCooking: HomeCookingData = {
      monthlyGroceryCost: 40000,
      householdSize: 1,
      shoppingHoursPerWeek: 3,
      cookingHoursPerWeek: 10,
    };

    const actualHourlyWage = 15000; // Very high wage

    const result = compareMealCosts(eatingOut, homeCooking, actualHourlyWage);

    expect(result.difference.monthly).toBeLessThan(0); // Negative = eating out is cheaper
    expect(result.recommendation).toContain('tímakaupi');
  });

  it('should calculate future value correctly', () => {
    const eatingOut: EatingOutData = {
      breakfastPerWeek: 5,
      breakfastCost: 1500,
      lunchPerWeek: 5,
      lunchCost: 2500,
      dinnerPerWeek: 2,
      dinnerCost: 4000,
      coffeePerWeek: 5,
      coffeeCost: 650,
      fastFoodPerWeek: 1,
      fastFoodCost: 2000,
    };

    const homeCooking: HomeCookingData = {
      monthlyGroceryCost: 60000,
      householdSize: 2,
      shoppingHoursPerWeek: 2,
      cookingHoursPerWeek: 5,
    };

    const actualHourlyWage = 3000;

    const result = compareMealCosts(eatingOut, homeCooking, actualHourlyWage);

    expect(result.futureValue.years10).toBeGreaterThan(0);
    expect(result.futureValue.years20).toBeGreaterThan(result.futureValue.years10);
    expect(result.futureValue.years30).toBeGreaterThan(result.futureValue.years20);
  });
});
```

#### Test Cases for Validation

```typescript
describe('validateEatingOutData', () => {
  it('should pass validation for valid data', () => {
    const data: EatingOutData = {
      breakfastPerWeek: 5,
      breakfastCost: 1500,
      lunchPerWeek: 5,
      lunchCost: 2500,
      dinnerPerWeek: 2,
      dinnerCost: 4000,
      coffeePerWeek: 10,
      coffeeCost: 650,
      fastFoodPerWeek: 1,
      fastFoodCost: 2000,
    };

    const result = validateEatingOutData(data);

    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors).length).toBe(0);
  });

  it('should fail for meals over 21', () => {
    const data: EatingOutData = {
      breakfastPerWeek: 25, // Invalid
      breakfastCost: 1500,
      lunchPerWeek: 5,
      lunchCost: 2500,
      dinnerPerWeek: 2,
      dinnerCost: 4000,
      coffeePerWeek: 10,
      coffeeCost: 650,
      fastFoodPerWeek: 1,
      fastFoodCost: 2000,
    };

    const result = validateEatingOutData(data);

    expect(result.isValid).toBe(false);
    expect(result.errors.breakfastPerWeek).toBeDefined();
  });

  it('should fail for negative costs', () => {
    const data: EatingOutData = {
      breakfastPerWeek: 5,
      breakfastCost: -100, // Invalid
      lunchPerWeek: 5,
      lunchCost: 2500,
      dinnerPerWeek: 2,
      dinnerCost: 4000,
      coffeePerWeek: 10,
      coffeeCost: 650,
      fastFoodPerWeek: 1,
      fastFoodCost: 2000,
    };

    const result = validateEatingOutData(data);

    expect(result.isValid).toBe(false);
    expect(result.errors.breakfastCost).toBeDefined();
  });
});
```

---

### Component Testing

#### Test Framework
- **React Testing Library**
- **Vitest**
- **Location**: `/src/components/mealCost/__tests__/`

#### Coverage Goals
- **80%+ coverage** fyrir React components
- All user interactions tested
- All conditional rendering tested

#### Test Cases for EatingOutInputs

```typescript
describe('EatingOutInputs', () => {
  it('should render all input fields', () => {
    const onChange = vi.fn();
    const data = DEFAULT_EATING_OUT;

    render(<EatingOutInputs data={data} onChange={onChange} />);

    expect(screen.getByLabelText(/morgunverðir/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/hádegisverðir/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/kvöldverðir/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/kaffi/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/skyndibitamáltíðir/i)).toBeInTheDocument();
  });

  it('should call onChange when values updated', async () => {
    const onChange = vi.fn();
    const data = DEFAULT_EATING_OUT;

    render(<EatingOutInputs data={data} onChange={onChange} />);

    const breakfastInput = screen.getByLabelText(/morgunverðir á viku/i);
    await userEvent.clear(breakfastInput);
    await userEvent.type(breakfastInput, '7');

    // Wait for debounce
    await waitFor(() => {
      expect(onChange).toHaveBeenCalled();
    }, { timeout: 1000 });
  });

  it('should show validation errors for invalid input', async () => {
    const onChange = vi.fn();
    const data = DEFAULT_EATING_OUT;

    render(<EatingOutInputs data={data} onChange={onChange} />);

    const breakfastInput = screen.getByLabelText(/morgunverðir á viku/i);
    await userEvent.clear(breakfastInput);
    await userEvent.type(breakfastInput, '25'); // Over 21

    await waitFor(() => {
      expect(screen.getByText(/á milli 0 og 21/i)).toBeInTheDocument();
    });
  });

  it('should populate from price presets', async () => {
    const onChange = vi.fn();
    const data = DEFAULT_EATING_OUT;

    render(<EatingOutInputs data={data} onChange={onChange} />);

    const presetSelect = screen.getByLabelText(/flýtival.*morgunverður/i);
    await userEvent.selectOptions(presetSelect, 'Kaffihús morgunverður');

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ breakfastCost: 1500 })
      );
    });
  });
});
```

#### Test Cases for MealCostComparison

```typescript
describe('MealCostComparison', () => {
  it('should display comparison results', () => {
    const eatingOut = DEFAULT_EATING_OUT;
    const homeCooking = DEFAULT_HOME_COOKING;
    const actualHourlyWage = 3000;

    render(
      <MealCostComparison
        eatingOutData={eatingOut}
        homeCookingData={homeCooking}
        actualHourlyWage={actualHourlyWage}
      />
    );

    expect(screen.getByText(/mat úti/i)).toBeInTheDocument();
    expect(screen.getByText(/heimaeldun/i)).toBeInTheDocument();
    expect(screen.getByText(/munur/i)).toBeInTheDocument();
  });

  it('should show savings when home cooking cheaper', () => {
    const eatingOut: EatingOutData = {
      breakfastPerWeek: 7,
      breakfastCost: 2000,
      lunchPerWeek: 7,
      lunchCost: 3000,
      dinnerPerWeek: 7,
      dinnerCost: 5000,
      coffeePerWeek: 14,
      coffeeCost: 700,
      fastFoodPerWeek: 0,
      fastFoodCost: 2000,
    };

    const homeCooking = DEFAULT_HOME_COOKING;
    const actualHourlyWage = 3000;

    render(
      <MealCostComparison
        eatingOutData={eatingOut}
        homeCookingData={homeCooking}
        actualHourlyWage={actualHourlyWage}
      />
    );

    expect(screen.getByText(/heimaeldun sparar/i)).toBeInTheDocument();
  });

  it('should show future value projections', () => {
    const eatingOut = DEFAULT_EATING_OUT;
    const homeCooking = DEFAULT_HOME_COOKING;
    const actualHourlyWage = 3000;

    render(
      <MealCostComparison
        eatingOutData={eatingOut}
        homeCookingData={homeCooking}
        actualHourlyWage={actualHourlyWage}
      />
    );

    expect(screen.getByText(/10 ár/i)).toBeInTheDocument();
    expect(screen.getByText(/20 ár/i)).toBeInTheDocument();
    expect(screen.getByText(/30 ár/i)).toBeInTheDocument();
  });
});
```

---

### Integration Testing

#### Test CalculatorContext Integration

```typescript
describe('MealCostCalculator with CalculatorContext', () => {
  it('should load actualHourlyWage from context', () => {
    const mockContext = {
      results: { actualHourlyWage: 5000 },
      mealCostData: DEFAULT_MEAL_COST_DATA,
      updateMealCostData: vi.fn(),
    };

    render(
      <CalculatorContext.Provider value={mockContext}>
        <MealCostCalculator />
      </CalculatorContext.Provider>
    );

    // Should not show warning
    expect(screen.queryByText(/vinsamlegast fylltu út/i)).not.toBeInTheDocument();
  });

  it('should show warning when actualHourlyWage is missing', () => {
    const mockContext = {
      results: { actualHourlyWage: 0 },
      mealCostData: DEFAULT_MEAL_COST_DATA,
      updateMealCostData: vi.fn(),
    };

    render(
      <CalculatorContext.Provider value={mockContext}>
        <MealCostCalculator />
      </CalculatorContext.Provider>
    );

    expect(screen.getByText(/vinsamlegast fylltu út/i)).toBeInTheDocument();
  });

  it('should save data to context on change', async () => {
    const updateMealCostData = vi.fn();
    const mockContext = {
      results: { actualHourlyWage: 5000 },
      mealCostData: DEFAULT_MEAL_COST_DATA,
      updateMealCostData,
    };

    render(
      <CalculatorContext.Provider value={mockContext}>
        <MealCostCalculator />
      </CalculatorContext.Provider>
    );

    const input = screen.getByLabelText(/morgunverðir á viku/i);
    await userEvent.clear(input);
    await userEvent.type(input, '7');

    await waitFor(() => {
      expect(updateMealCostData).toHaveBeenCalled();
    }, { timeout: 1000 });
  });
});
```

---

### Accessibility Testing

#### Test Framework
- **jest-axe** fyrir automated a11y testing
- **Manual testing** með screen readers

#### Test Cases

```typescript
describe('Accessibility', () => {
  it('should have no axe violations - EatingOutInputs', async () => {
    const { container } = render(
      <EatingOutInputs data={DEFAULT_EATING_OUT} onChange={vi.fn()} />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper ARIA labels', () => {
    render(<EatingOutInputs data={DEFAULT_EATING_OUT} onChange={vi.fn()} />);

    const inputs = screen.getAllByRole('spinbutton');
    inputs.forEach((input) => {
      expect(input).toHaveAttribute('aria-label');
    });
  });

  it('should be keyboard navigable', async () => {
    render(<EatingOutInputs data={DEFAULT_EATING_OUT} onChange={vi.fn()} />);

    const firstInput = screen.getByLabelText(/morgunverðir á viku/i);
    firstInput.focus();
    expect(firstInput).toHaveFocus();

    await userEvent.tab();
    const secondInput = screen.getByLabelText(/verð morgunverðar/i);
    expect(secondInput).toHaveFocus();
  });

  it('should announce errors to screen readers', async () => {
    render(<EatingOutInputs data={DEFAULT_EATING_OUT} onChange={vi.fn()} />);

    const input = screen.getByLabelText(/morgunverðir á viku/i);
    await userEvent.clear(input);
    await userEvent.type(input, '-5');

    const errorMessage = await screen.findByText(/fjöldi máltíða/i);
    expect(errorMessage).toHaveAttribute('role', 'alert');
  });
});
```

---

### Manual Testing Checklist

#### Responsive Design
- [ ] Mobile (320px - 767px): Stacked layout, readable text
- [ ] Tablet (768px - 1023px): Optimal layout for medium screens
- [ ] Desktop (1024px+): Side-by-side comparison, all features visible

#### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

#### Screen Reader Testing
- [ ] VoiceOver (macOS/iOS): All content readable
- [ ] NVDA (Windows): Proper navigation
- [ ] JAWS (Windows): Form fields announced correctly

#### User Workflows
- [ ] NS-1: Skrá matarvenjur utan heimilis
- [ ] NS-2: Skrá kaffi og drykkjarkaup
- [ ] NS-3: Skrá skyndibitakaup
- [ ] NS-4: Skrá heimaeldunar kostnað
- [ ] NS-5: Sjá samanburð á kostnaði
- [ ] NS-6: Sjá áhrif á fjárhagslegt frelsi
- [ ] NS-7: Bera saman mataræðisáætlanir
- [ ] NS-8: Flýtival fyrir algeng íslensk verð

#### Edge Cases
- [ ] Zero actual hourly wage
- [ ] All zeros in eating out
- [ ] All zeros in home cooking
- [ ] Very high hourly wage (100,000 kr/hr)
- [ ] Maximum meal counts (21)
- [ ] localStorage full
- [ ] localStorage disabled
- [ ] Import invalid file
- [ ] Export and re-import data

---

### Performance Testing

#### Metrics
- [ ] Initial render < 100ms
- [ ] Input onChange debounce 500ms works
- [ ] Calculation update < 50ms
- [ ] No memory leaks after repeated use
- [ ] Bundle size impact < 50KB

#### Tools
- Chrome DevTools Performance tab
- React DevTools Profiler
- Lighthouse audit

---

### Test Coverage Summary

Target coverage levels:

| Area | Target Coverage |
|------|----------------|
| Calculation functions | 95%+ |
| React components | 80%+ |
| TypeScript types | 100% |
| Error handling | 90%+ |
| Integration flows | 80%+ |

---

### Continuous Integration

```yaml
# .github/workflows/test.yml (partial)
- name: Run meal cost tests
  run: |
    npm run test:unit -- --coverage --watchAll=false
    npm run test:component -- --coverage --watchAll=false

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
    flags: mealcost
```

## Hönnunarákvarðanir (Design Decisions)

### Ákvörðun 1: Client-side eingöngu útreikningar

**Samhengi**: Ákveða þarf hvort útreikningar fara fram á client eða server

**Valkostir sem voru skoðaðir**:
1. **Client-side only (Pure JavaScript)**
   - Kostir: Privacy, offline capable, engin backend kostnaður, fljótt
   - Gallar: Takmarkað af browser performance, code visible í browser
   - Áhætta: Lítil - calculations eru einfaldir

2. **Server-side API**
   - Kostir: Centralized logic, can log analytics, easier updates
   - Gallar: Privacy concerns, requires backend, network latency, costs
   - Áhætta: Meðal - privacy er mikilvægt fyrir financial data

3. **Hybrid (cache on client, validate on server)**
   - Kostir: Best of both worlds
   - Gallar: Flókið, requires backend, overhead
   - Áhætta: Há - unnecessary complexity

**Ákvörðun**: Client-side only

**Rökstuðningur**:
- Privacy-first: Engin notendagögn fara út úr vafra
- Offline capable: Virkar án internettengingar
- Performance: Instant calculations (< 50ms requirement)
- Cost: Engin backend kostnaður
- Existing pattern: Fylgir Subscription Burn Meter pattern
- Simple calculations: Einfaldur reikningur þarfnast ekki server

**Áhrif á implementation**:
- Öll calculation logic í `/lib/calculations/mealCost.ts`
- localStorage fyrir persistence
- Export/import fyrir backup

**Kröfur sem uppfylltar**: Afköst krafan (< 50ms), Privacy (engin netþjóns gögn)

---

### Ákvörðun 2: Integration með CalculatorContext vs Standalone State

**Samhengi**: Ákveða hvort Matkostnaðarmælir á að vera hluti af CalculatorContext eða hafa sína eigin state management

**Valkostir sem voru skoðaðir**:
1. **Integration með CalculatorContext**
   - Kostir: Aðgangur að actualHourlyWage, unified export/import, consistent patterns
   - Gallar: Coupling, CalculatorContext stækkar
   - Áhætta: Lítil - well-defined interface

2. **Standalone með own Context**
   - Kostir: Decoupled, independent, easier testing
   - Gallar: Duplicate export/import logic, no access to actualHourlyWage
   - Áhætta: Meðal - würde need prop drilling or global state

3. **Redux/Zustand fyrir global state**
   - Kostir: Better state management for complex apps
   - Gallar: Overkill, new dependency, learning curve
   - Áhætta: Há - unnecessary complexity

**Ákvörðun**: Integration með CalculatorContext

**Rökstuðningur**:
- actualHourlyWage dependency: Þarf að sækja úr main calculator
- Unified export/import: User expects all data in one export
- Consistent patterns: Fylgir Subscription model
- Einfaldleiki: Engar nýjar dependencies
- Single source of truth fyrir app state

**Áhrif á implementation**:
- Bæta við `mealCostData` í CalculatorContext
- Bæta við `updateMealCostData`, `updateEatingOut`, `updateHomeCooking` functions
- Bæta við `mealCostSummary` computed property (memoized)
- Bæta við mealCostData í StoredState

**Kröfur sem uppfylltar**: Tengsl við Raunverulegt Tímakaup (REQ), Export/Import virkni

---

### Ákvörðun 3: Weeks per month = 4.33 vs 4

**Samhengi**: Ákveða hvernig á að umbreyta vikulegum kostnaði í mánaðarlegan

**Valkostir sem voru skoðaðir**:
1. **4.33 weeks per month (52 / 12)**
   - Kostir: Mathematically accurate, aligns with yearly calculations
   - Gallar: Slightly confusing for users, non-round number
   - Áhætta: Engin

2. **4 weeks per month**
   - Kostir: Simple, easy to understand
   - Gallar: Under-estimates monthly cost, 48 weeks per year (not 52)
   - Áhætta: Meðal - inaccurate yearly totals

3. **30.42 days per month (365 / 12) með day calculations**
   - Kostir: Very accurate
   - Gallar: Complex, users think in weeks not days
   - Áhætta: Há - confusion

**Ákvörðun**: 4.33 weeks per month

**Rökstuðningur**:
- Mathematical accuracy: 52 weeks / 12 months = 4.33
- Aligns with yearly: Weekly × 52 = Yearly, Monthly × 12 = Yearly
- Industry standard: Most financial calculators use 4.33
- Consistency: Subscription calculator might use similar pattern
- Minimal confusion: Users don't see the constant, just the results

**Áhrif á implementation**:
```typescript
export const WEEKS_PER_MONTH = 4.33;
const monthlyTotal = weeklyTotal * WEEKS_PER_MONTH;
const yearlyTotal = weeklyTotal * 52;
```

**Kröfur sem uppfylltar**: Útreikningsformúlur frá requirements

---

### Ákvörðun 4: Heimaeldun time cost included vs excluded

**Samhengi**: Ákveða hvort tímakostnaður (shopping + cooking) á að vera innifalinn í heimaeldunar kostnaði

**Valkostir sem voru skoðaðir**:
1. **Include time cost (shopping + cooking × hourly wage)**
   - Kostir: True total cost, fair comparison með eating out
   - Gallar: May discourage home cooking, complex
   - Áhætta: Lítil - aligns with YMYL philosophy

2. **Exclude time cost (only groceries)**
   - Kostir: Simple, encourages home cooking
   - Gallar: Unfair comparison, ignores time value
   - Áhætta: Há - inaccurate, misleading

3. **Optional toggle (let user choose)**
   - Kostir: Flexibility
   - Gallar: Confusing, adds complexity, extra UI
   - Áhætta: Meðal - decision paralysis

**Ákvörðun**: Include time cost

**Rökstuðningur**:
- "Your Money or Your Life" philosophy: Tími = lífsorka
- Fair comparison: Eating out saves time, should be reflected
- Reveals true cost: High earners may benefit from eating out
- Aligns with requirements: NS-4 explicitly includes time
- Educational: Helps users understand total cost of home cooking
- Honest: Even if result doesn't encourage home cooking, it's truthful

**Áhrif á implementation**:
```typescript
const weeklyGroceryCost = data.monthlyGroceryCost / 4.33;
const shoppingTimeCost = data.shoppingHoursPerWeek * actualHourlyWage;
const cookingTimeCost = data.cookingHoursPerWeek * actualHourlyWage;
return weeklyGroceryCost + shoppingTimeCost + cookingTimeCost;
```

**Kröfur sem uppfylltar**: NS-4, Heildar kostnaður formúla

---

### Ákvörðun 5: Price presets vs Free-form only

**Samhengi**: Ákveða hvort bjóða eigi upp á forstillt verð fyrir íslenskar aðstæður

**Valkostir sem voru skoðaðir**:
1. **Price presets + manual override**
   - Kostir: Easy for new users, realistic defaults, faster input
   - Gallar: Presets may not match user's area, maintenance burden
   - Áhætta: Lítil - users can override

2. **Free-form only (no presets)**
   - Kostir: Simple, no maintenance, users know their costs
   - Gallar: Harder for new users, empty field syndrome
   - Áhætta: Meðal - poor UX for new users

3. **API-based real-time pricing**
   - Kostir: Always accurate
   - Gallar: Requires API, privacy issues, depends on availability
   - Áhætta: Há - API may not exist, costs, reliability

**Ákvörðun**: Price presets + manual override

**Rökstuðningur**:
- UX improvement: Faster initial setup
- Requirements: NS-8 explicitly requests presets
- Realistic estimates: Based on Reykjavík 2026 pricing
- Educational: Shows users typical costs
- Flexibility: Users can override any value
- Low maintenance: Prices don't change drastically
- Follows pattern: Similar to Subscription presets

**Áhrif á implementation**:
```typescript
export const MEAL_PRICE_PRESETS = {
  breakfast: [
    { label: 'Kaffihús morgunverður', value: 1500 },
    { label: 'Veitingahús morgunverður', value: 2500 },
    { label: 'Hótel morgunhlaðborð', value: 3500 },
  ],
  // ... more presets
};
```

**Kröfur sem uppfylltar**: NS-8 (Flýtival fyrir algeng íslensk verð)

---

### Ákvörðun 6: 5 Scenario presets vs Custom scenarios only

**Samhengi**: Ákveða hvort bjóða eigi upp á forstilltar atburðarásir fyrir samanburð

**Valkostir sem voru skoðaðir**:
1. **5 predefined scenarios (from requirements)**
   - Kostir: Quick comparison, educational, matches requirements
   - Gallar: Not customizable, may not fit all users
   - Áhætta: Engin

2. **Custom scenarios only (user creates)**
   - Kostir: Fully customizable, fits any situation
   - Gallar: More work for user, requires understanding
   - Áhætta: Meðal - cognitive overhead

3. **Predefined + Save custom**
   - Kostir: Best of both worlds
   - Gallar: More complex, storage requirements
   - Áhætta: Lítil - manageable complexity

**Ákvörðun**: 5 predefined scenarios (future: + save custom)

**Rökstuðningur**:
- Requirements: NS-7 specifies 5 scenarios
- Educational value: Shows common patterns
- Quick comparison: No setup needed
- MVP scope: Custom scenarios can be added later
- Clear differentiation: All-out, typical, moderate, mostly-home, all-home
- Users can still modify presets after selection

**Áhrif á implementation**:
- Define 5 presets in constants
- MealPresetSelector component
- Comparison table component
- Future: Add ability to save custom scenarios

**Kröfur sem uppfylltar**: NS-7 (Bera saman mataræðisáætlanir)

---

### Ákvörðun 7: Debounce 500ms vs Real-time vs onBlur

**Samhengi**: Ákveða hvenær á að uppfæra útreikninga eftir input breytingu

**Valkostir sem voru skoðaðir**:
1. **Debounce 500ms**
   - Kostir: Reduces calculations, good UX, prevents jitter
   - Gallar: Slight delay before seeing results
   - Áhætta: Engin

2. **Real-time (no debounce)**
   - Kostir: Immediate feedback
   - Gallar: Excessive calculations, jittery UI, performance issues
   - Áhætta: Meðal - may cause lag

3. **onBlur only (when field loses focus)**
   - Kostir: Minimal calculations, clear update points
   - Gallar: Poor UX, no live preview
   - Áhætta: Há - users expect live updates

**Ákvörðun**: Debounce 500ms

**Rökstuðningur**:
- Requirements: Krafan segir 500ms debounce fyrir localStorage
- Performance: Reduces unnecessary calculations during typing
- UX: Fast enough to feel responsive (< 1 second)
- Industry standard: Most financial calculators use 300-500ms
- Battery-friendly: Fewer calculations on mobile
- Follows pattern: Consistent with other app features

**Áhrif á implementation**:
```typescript
const debouncedUpdate = useMemo(
  () => debounce(updateMealCostData, 500),
  [updateMealCostData]
);
```

**Kröfur sem uppfylltar**: Áreiðanleiki (auto-save 500ms debounce)

---

### Ákvörðun 8: Show cost per person for home cooking

**Samhengi**: Ákveða hvort sýna eigi kostnað á mann fyrir heimaeldun

**Valkostir sem voru skoðaðir**:
1. **Show cost per person (for households > 1)**
   - Kostir: Useful for budgeting, fair comparison with eating out alone
   - Gallar: May be confusing, adds calculation
   - Áhætta: Engin

2. **Only show total household cost**
   - Kostir: Simple, clear
   - Gallar: Hard to compare for individuals in family
   - Áhætta: Lítil - missing useful insight

**Ákvörðun**: Show cost per person

**Rökstuðningur**:
- Practical: Families want to know cost per person
- Comparison: Easier to compare with single eating out
- Requirements: NS-4 asks for "kostnaður á mann"
- Conditional: Only shown when householdSize > 1
- Simple calculation: monthlyTotal / householdSize

**Áhrif á implementation**:
```typescript
const costPerPerson = type === 'homeCooking'
  ? monthlyTotal / data.householdSize
  : undefined;
```

Display:
```tsx
{costPerPerson && (
  <div>Kostnaður á mann: {formatCurrency(costPerPerson)}</div>
)}
```

**Kröfur sem uppfylltar**: NS-4 (Kostnaður á mann)

## Kröfurekjanleiki (Requirements Traceability)

### NS-1: Skrá matarvenjur utan heimilis

**Design Elements**:
- **Architecture**: Client-side form með real-time validation
- **Components**:
  - `EatingOutInputs` - handles all eating out data entry
  - Input fields fyrir morgun/hádegis/kvöld máltíðir (per week, 0-21)
  - CurrencyInput fyrir verð
- **Data Models**:
  - `EatingOutData` interface með öllum meal properties
  - Validation rules: meals 0-21, costs > 0
- **Calculations**:
  - `calculateEatingOutWeeklyCost()` - sums all meal categories
  - Automatic conversion to monthly/yearly
- **Error Handling**:
  - Real-time validation með íslenskum villuskilaboðum
  - Prevents invalid submissions
- **Testing**:
  - Unit tests fyrir validation logic
  - Component tests fyrir input handling
  - Manual testing checklist item

---

### NS-2: Skrá kaffi og drykkjarkaup

**Design Elements**:
- **Architecture**: Part of EatingOutInputs, separate category
- **Components**:
  - Input fields fyrir coffeePerWeek og coffeeCost
  - Forstillt gildi: 650 kr (kaffihús espresso)
- **Data Models**:
  - `coffeePerWeek` og `coffeeCost` í EatingOutData
  - >= 0 validation (no upper limit)
- **Calculations**:
  - Included í calculateEatingOutWeeklyCost
  - Separate line item í breakdown
- **Testing**: Validation tests fyrir coffee inputs

---

### NS-3: Skrá skyndibitakaup

**Design Elements**:
- **Architecture**: Separate category í eating out data
- **Components**:
  - fastFoodPerWeek og fastFoodCost inputs
  - Forstillt gildi: 2000 kr
- **Data Models**:
  - `fastFoodPerWeek` (0-21) og `fastFoodCost` (> 0)
- **Calculations**:
  - Sundurliðun shows skyndibitir separately frá veitingahúsum
  - generateEatingOutBreakdown creates separate line item
- **Testing**: Unit tests verify separate tracking

---

### NS-4: Skrá heimaeldunar kostnað

**Design Elements**:
- **Architecture**: HomeCookingInputs component with time cost calculation
- **Components**:
  - `HomeCookingInputs` - 4 inputs (groceries, household size, shopping time, cooking time)
  - Calculated field shows cost per person
  - Preview shows time cost calculation
- **Data Models**:
  - `HomeCookingData` interface
  - Validation: groceries > 0, household >= 1, hours >= 0
- **Calculations**:
  - `calculateHomeCookingWeeklyCost()` - includes grocery + time costs
  - Formula: (Groceries / 4.33) + (Shopping × Wage) + (Cooking × Wage)
  - `costPerPerson` calculated when householdSize > 1
- **Error Handling**: Validation fyrir öll four fields
- **Testing**: Unit tests verify time cost inclusion

---

### NS-5: Sjá samanburð á kostnaði

**Design Elements**:
- **Architecture**: MealCostComparison component with two-column layout
- **Components**:
  - `MealCostComparison` - shows side-by-side comparison
  - `MealCostBreakdown` - detailed breakdowns
  - Displays monthly/yearly costs, life energy, difference
- **Data Models**:
  - `ComparisonResults` interface with difference and FV
  - `MealCostSummary` fyrir hvorn valkost
- **Calculations**:
  - `compareMealCosts()` - calculates all differences
  - Percentage difference calculated
  - Sign convention: positive = home is cheaper
- **UI**:
  - Green for savings, warning colors for overspending
  - Responsive: stacked on mobile, side-by-side on desktop
  - Expandable breakdowns on mobile
- **Error Handling**: Shows warning if actualHourlyWage missing
- **Testing**: Component tests verify comparison display

---

### NS-6: Sjá áhrif á fjárhagslegt frelsi

**Design Elements**:
- **Architecture**: Future value section í MealCostComparison
- **Components**:
  - FV display shows 10/20/30 year projections
  - Clear labels með explanatory text
- **Data Models**:
  - `futureValue` object í ComparisonResults
  - `years10`, `years20`, `years30` properties
- **Calculations**:
  - Reuses `calculateFutureValue()` from subscriptions.ts
  - Formula: FV = PMT × ((1 + r)^n - 1) / r
  - 7% annual return rate
  - Handles both positive (savings) and negative (cost)
- **UI**:
  - Card layout með success color
  - Explanatory text: "Ef þú fjárfestir X kr á mánuði í 20 ár..."
- **Testing**: Unit tests verify FV calculations accurate

---

### NS-7: Bera saman mataræðisáætlanir

**Design Elements**:
- **Architecture**: MealPresetSelector component with comparison table
- **Components**:
  - `MealPresetSelector` - dropdown or buttons fyrir presets
  - Comparison table component (responsive)
  - 5 preset buttons for quick selection
- **Data Models**:
  - `MealScenarioPreset` interface
  - `MEAL_SCENARIO_PRESETS` constant með 5 scenarios
- **Presets Defined**:
  1. "Borða úti alla daga" - 21 meals/week out
  2. "Venjulegur vinnandi" - 5 lunches/week out
  3. "Hóflega heimaeldun" - home 5 days, out weekends
  4. "Mikil heimaeldun" - home 6 days, out 1 day
  5. "100% heimaeldun" - all meals at home
- **UI**:
  - Table columns: Scenario | Monthly Cost | Life Energy | Savings | FV (20 years)
  - Horizontal scroll on mobile
  - Highlight current scenario
- **Calculations**: Run compareMealCosts for each preset vs current
- **Testing**: Component tests verify preset loading and comparison

---

### NS-8: Flýtival fyrir algeng íslensk verð

**Design Elements**:
- **Architecture**: Price presets integrated into input components
- **Components**:
  - Select dropdowns við each price input
  - Quick buttons or dropdown list
- **Data Models**:
  - `MEAL_PRICE_PRESETS` constant með categories:
    - breakfast: 3 options (1500-3500 kr)
    - lunch: 4 options (1800-4500 kr)
    - dinner: 4 options (2000-10000 kr)
    - coffee: 3 options (400-1000 kr)
    - fastFood: 1 option (2000 kr)
- **UI**:
  - Select next to each cost input
  - "Veldu verð" placeholder
  - User can override after selecting
- **Testing**: Component tests verify preset population

---

### Kröfur sem ekki tengjast virkni (Non-functional Requirements)

#### Afköst (Performance)
- **REQ**: Uppfæra innan < 50ms
- **Design**:
  - Client-side pure functions (no network delay)
  - useMemo fyrir expensive calculations
  - Debounce 500ms fyrir localStorage writes
- **Testing**: Performance tests verify < 50ms calculation time

#### Aðgengi (Accessibility - WCAG 2.1 AA)
- **REQ**: WCAG 2.1 AA compliance
- **Design**:
  - Semantic HTML með proper labels
  - ARIA attributes fyrir screen readers
  - Keyboard navigation (Tab, Enter, Escape)
  - Color contrast 4.5:1 minimum
  - Error messages með role="alert"
- **Testing**:
  - jest-axe for automated a11y testing
  - Manual screen reader testing
  - Keyboard navigation tests

#### Móttækileg hönnun (Responsive)
- **REQ**: Virka á öllum skjástærðum (320px - 1920px+)
- **Design**:
  - Mobile (320-767px): Stacked vertical layout
  - Tablet (768-1023px): Optimized middle ground
  - Desktop (1024px+): Side-by-side comparison
  - Tailwind responsive classes (sm:, md:, lg:)
- **Testing**: Manual testing checklist fyrir hverja screen size

#### Persónuvernd (Privacy)
- **REQ**: localStorage only, engin netþjóns gögn
- **Design**:
  - Client-side calculations only
  - localStorage fyrir persistence
  - Export/import fyrir data portability
  - Storage key: `peninganaedalifid_matkostnadur`
- **Testing**: Verify no network calls made

#### Tungumál (Icelandic)
- **REQ**: Allur texti á íslensku
- **Design**:
  - All UI text in Icelandic
  - Number formatting: 1.000.000 kr (punktur sem þúsundaskil)
  - Proper declension: "1 klukkustund" vs "2 klukkustundir"
  - Error messages in Icelandic
- **Testing**: Manual review fyrir íslenska grammatíkur

#### Áreiðanleiki (Reliability)
- **REQ**: Sjálfvirk vista með 500ms debounce, handle localStorage failures
- **Design**:
  - Debounced auto-save
  - Try/catch fyrir localStorage operations
  - Fallback til session-only mode ef localStorage fails
  - Toast notifications fyrir errors
- **Testing**: Unit tests fyrir storage error handling

---

### Samantekt á kröfum

| Kröfu ID | Nafn | Hönnunar þáttur | Status |
|----------|------|----------------|--------|
| NS-1 | Skrá mat úti | EatingOutInputs component | ✅ Addressed |
| NS-2 | Skrá kaffi | Coffee inputs í EatingOutInputs | ✅ Addressed |
| NS-3 | Skrá skyndibita | FastFood inputs í EatingOutInputs | ✅ Addressed |
| NS-4 | Skrá heimaeldun | HomeCookingInputs component | ✅ Addressed |
| NS-5 | Sjá samanburð | MealCostComparison component | ✅ Addressed |
| NS-6 | Sjá FI áhrif | Future value calculations | ✅ Addressed |
| NS-7 | Bera saman atburðarásir | MealPresetSelector component | ✅ Addressed |
| NS-8 | Flýtival verð | MEAL_PRICE_PRESETS constants | ✅ Addressed |
| NFR-Afköst | < 50ms uppfærsla | Pure functions, useMemo | ✅ Addressed |
| NFR-Aðgengi | WCAG 2.1 AA | Semantic HTML, ARIA, keyboard | ✅ Addressed |
| NFR-Responsive | 320px - 1920px+ | Tailwind responsive classes | ✅ Addressed |
| NFR-Privacy | localStorage only | No API calls, client-side only | ✅ Addressed |
| NFR-Tungumál | Íslenska | All text in Icelandic | ✅ Addressed |
| NFR-Reliability | Auto-save, handle errors | Debounce, error handling | ✅ Addressed |
