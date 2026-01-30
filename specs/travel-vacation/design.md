# Hönnun: Ferða- og Frístundakostnaðarreiknivél (Travel/Vacation Cost Calculator)

## Yfirlit

**Eiginleiki**: Ferða- og Frístundakostnaðarreiknivél
**Hönnunarfasi**: Tæknilegt hönnunarskjal
**Tengist kröfulýsingu**: `/specs/travel-vacation/requirements.md`

## Arkitektúr

### Kerfisskipan

```
┌─────────────────────────────────────────────────────────┐
│                   React Component Layer                 │
│  ┌───────────────────────────────────────────────────┐  │
│  │  TravelVacationPage                               │  │
│  │  ┌─────────────────┐  ┌─────────────────────────┐ │  │
│  │  │ TripInputSection│  │ TripResultsSection      │ │  │
│  │  │                 │  │ - LifeEnergyDisplay     │ │  │
│  │  │ - Trip details  │  │ - OpportunityCostDisplay│ │  │
│  │  │ - Cost inputs   │  │ - StaycationComparison  │ │  │
│  │  │ - Presets       │  │ - FIImpactDisplay       │ │  │
│  │  │ - Settings      │  │                         │ │  │
│  │  └─────────────────┘  └─────────────────────────┘ │  │
│  │                                                    │  │
│  │  ┌──────────────────────────────────────────────┐ │  │
│  │  │ ComparisonView (optional)                    │ │  │
│  │  │ - Up to 3 trip options side-by-side         │ │  │
│  │  │ - Comparison insights                        │ │  │
│  │  └──────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                  Calculation Engine                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │  travelVacationCalculations.ts                    │  │
│  │  - calculateTripCost()                            │  │
│  │  │  - calculateLifeEnergyCost()                   │  │
│  │  │  - calculateOpportunityCost()                  │  │
│  │  │  - calculateFIImpact()                         │  │
│  │  │  - calculateStaycationComparison()             │  │
│  │  - compareTrips()                                 │  │
│  │  - formatters (currency, time, etc.)              │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    Data Layer                            │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Context/Store                                     │  │
│  │  - CalculatorContext (actualHourlyWage, FI data)  │  │
│  │  - TravelVacationState                            │  │
│  └───────────────────────────────────────────────────┘  │
│                            │                             │
│  ┌───────────────────────────────────────────────────┐  │
│  │  localStorage                                      │  │
│  │  - Persist last calculation                        │  │
│  │  - Part of main app export/import                 │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Dataflæði

```
User Input (Trip Details + Costs)
         ↓
    Validation
         ↓
    State Update
         ↓
Calculate Total Trip Cost
         ↓
Calculate Life Energy Cost ← actualHourlyWage (from CalculatorContext)
         ↓
Calculate Opportunity Cost ← returnRate (from settings)
         ↓
Calculate Staycation Comparison (optional) ← staycation daily cost
         ↓
Calculate FI Impact (optional) ← FI data (from CalculatorContext)
         ↓
    Render Results
         ↓
Save to localStorage (debounced)
```

---

## Gagnalíkön

### TypeScript Interfaces

```typescript
/**
 * Kostnaðarliðir ferðar
 */
interface TripCosts {
  /** Flug eða aðrar farmiðagjöld (kr) */
  transportation: number;
  /** Heildarkostnaður gistingar (kr) */
  accommodation: number;
  /** Daglegur matarkostnaður (kr/dag) */
  foodPerDay: number;
  /** Heildarkostnaður afþreyingar/athafna (kr) */
  activities: number;
  /** Staðbundnar samgöngur (bílaleiga, leigubílar, o.s.frv.) (kr) */
  localTransport: number;
  /** Annar kostnaður (kr) */
  other: number;
}

/**
 * Grunnupplýsingar um ferð
 */
interface TripDetails {
  /** Heiti ferðar (valfrjálst) */
  name?: string;
  /** Lengd ferðar í dögum */
  days: number;
  /** Áfangastaður (valfrjálst) */
  destination?: string;
}

/**
 * Heildar inntaksgögn fyrir ferð
 */
interface TripInput {
  /** Grunnupplýsingar */
  details: TripDetails;
  /** Kostnaðarliðir */
  costs: TripCosts;
}

/**
 * Stillingar fyrir útreikninga
 */
interface TravelCalculationSettings {
  /** Vænt árleg ávöxtun fjárfestinga (0-1, t.d. 0.07 fyrir 7%) */
  expectedReturnRate: number;
  /** Tímabil í árum fyrir framtíðarvirði útreikninga */
  futureValueYears: number[];
  /** Daglegur staycation kostnaður (0 ef ónotað) */
  staycationDailyCost: number;
  /** Hvort sýna staycation samanburð */
  showStaycationComparison: boolean;
}

/**
 * Sundurliðun heildarkostnaðar
 */
interface TotalCostBreakdown {
  /** Heildarkostnaður (kr) */
  total: number;
  /** Sundurliðun eftir flokkum */
  breakdown: {
    transportation: number;
    accommodation: number;
    food: number; // foodPerDay × days
    activities: number;
    localTransport: number;
    other: number;
  };
  /** Kostnaður á dag (kr/dag) */
  costPerDay: number;
}

/**
 * Lífsorgu kostnaður ferðar
 */
interface LifeEnergyCost {
  /** Heildar klukkustundir vinnu */
  totalHours: number;
  /** Vinnudagar (miðað við 8 klst dag) */
  workDays: number;
  /** Vinnuvikur (miðað við 40 klst viku) */
  workWeeks: number;
  /** Lífsorgu klukkustundir á ferðadag */
  hoursPerTripDay: number;
  /** Læsileg strengur formatering */
  formattedString: string;
}

/**
 * Framtíðarvirði fyrir eitt tímabil
 */
interface FutureValueResult {
  /** Fjöldi ára */
  years: number;
  /** Framtíðarvirði í krónum */
  value: number;
  /** Læsileg strengur formatering */
  formattedValue: string;
}

/**
 * Tækifæriskostnaður
 */
interface OpportunityCost {
  /** Framtíðarvirði fyrir öll tímabil */
  futureValues: FutureValueResult[];
  /** Tækifæriskostnaður á ferðadag (20 ára FV / lengd) */
  opportunityCostPerDay: number;
}

/**
 * Staycation samanburður (valfrjálst)
 */
interface StaycationComparison {
  /** Heildarkostnaður að vera heima */
  staycationTotalCost: number;
  /** Aukakostnaður ferðar (ferð - heima) */
  additionalCostToTravel: number;
  /** Aukakostnaður í lífsorgu klukkustundum */
  additionalLifeEnergyHours: number;
  /** Læsilegur texti */
  formattedSummary: string;
}

/**
 * Áhrif á FI tímalínu (valfrjálst)
 */
interface FIImpact {
  /** Auka vinnuklukkustundir til FI */
  additionalWorkHours: number;
  /** Töf á FI dagsetningu í dögum */
  delayDays: number;
  /** Töf í mánuðum (námundað) */
  delayMonths: number;
  /** Fjöldi sambærilegra ferða sem tefur FI um 1 mánuð */
  tripsPerMonthDelay: number;
  /** Læsilegur samantekt */
  formattedDelay: string;
}

/**
 * Heildniðurstöður fyrir eina ferð
 */
interface TripCalculationResult {
  /** Inntaksgögn */
  input: TripInput;
  /** Heildarkostnaður með sundurliðun */
  totalCost: TotalCostBreakdown;
  /** Lífsorgu kostnaður */
  lifeEnergyCost: LifeEnergyCost;
  /** Tækifæriskostnaður */
  opportunityCost: OpportunityCost;
  /** Staycation samanburður (ef virkjað) */
  staycationComparison?: StaycationComparison;
  /** FI áhrif (ef til staðar) */
  fiImpact?: FIImpact;
}

/**
 * Samanburður á mörgum ferðavalkostum
 */
interface TripComparison {
  /** Listi af niðurstöðum (2-3 valkostir) */
  trips: TripCalculationResult[];
  /** Index á ódýrasta valkostinum */
  cheapestTripIndex: number;
  /** Mismunur á lífsorgu milli dýrasta og ódýrasta */
  maxLifeEnergyDifference: number;
  /** Sparnaður með því að velja ódýrasta */
  savingsWithCheapest: {
    currency: number;
    lifeEnergyHours: number;
  };
}

/**
 * Forstillingar fyrir algengar ferðir
 */
interface TripPreset {
  /** Heiti forstillingar */
  name: string;
  /** Lýsing */
  description: string;
  /** Típísk lengd (dagar) */
  typicalDays: number;
  /** Áætlaðir kostnaðarliðir (svið) */
  estimatedCosts: {
    transportation: { min: number; max: number };
    accommodation: { min: number; max: number };
    foodPerDay: { min: number; max: number };
    activities: { min: number; max: number };
    localTransport: { min: number; max: number };
    other: { min: number; max: number };
  };
}

/**
 * Vistaðar ástandar fyrir component
 */
interface TravelVacationState {
  /** Aðalferð sem verið er að skoða */
  mainTrip: TripInput;
  /** Samanburðar valkostir (0-2 viðbótar) */
  comparisonTrips: TripInput[];
  /** Stillingar */
  settings: TravelCalculationSettings;
  /** Hvort sýna samanburðarham */
  showComparison: boolean;
}

/**
 * Gögn frá CalculatorContext sem þarf
 */
interface RequiredCalculatorData {
  /** Raunverulegt tímakaup úr Actual Hourly Wage Calculator */
  actualHourlyWage: number | null;
  /** FI gögn (valfrjálst) */
  fiData?: {
    /** Árlegur sparnaður */
    annualSavings: number;
    /** Núverandi FI dagsetning (ef reiknuð) */
    fiDate?: Date;
  };
}
```

### Sjálfgefin gildi

```typescript
const DEFAULT_SETTINGS: TravelCalculationSettings = {
  expectedReturnRate: 0.07, // 7%
  futureValueYears: [10, 20, 30],
  staycationDailyCost: 0,
  showStaycationComparison: false,
};

const INITIAL_TRIP_INPUT: TripInput = {
  details: {
    name: '',
    days: 7,
    destination: '',
  },
  costs: {
    transportation: 0,
    accommodation: 0,
    foodPerDay: 0,
    activities: 0,
    localTransport: 0,
    other: 0,
  },
};

const INITIAL_STATE: TravelVacationState = {
  mainTrip: INITIAL_TRIP_INPUT,
  comparisonTrips: [],
  settings: DEFAULT_SETTINGS,
  showComparison: false,
};

/**
 * Forstillingar fyrir algengar ferðir frá Íslandi
 */
const TRIP_PRESETS: TripPreset[] = [
  {
    name: 'Helgarferð til Evrópu',
    description: '3-4 daga borgarferð til Evrópu',
    typicalDays: 4,
    estimatedCosts: {
      transportation: { min: 40000, max: 80000 },
      accommodation: { min: 80000, max: 160000 }, // 20k-40k/nótt × 4
      foodPerDay: { min: 8000, max: 15000 },
      activities: { min: 10000, max: 30000 },
      localTransport: { min: 5000, max: 15000 },
      other: { min: 5000, max: 15000 },
    },
  },
  {
    name: 'Viku sumarhús á Íslandi',
    description: 'Einnar viku dvöl í sumarbústað',
    typicalDays: 7,
    estimatedCosts: {
      transportation: { min: 0, max: 0 },
      accommodation: { min: 150000, max: 300000 },
      foodPerDay: { min: 8000, max: 12000 },
      activities: { min: 20000, max: 50000 },
      localTransport: { min: 15000, max: 30000 }, // bensín
      other: { min: 10000, max: 30000 },
    },
  },
  {
    name: 'Tveggja vikna sólarhringshryðjuferð',
    description: 'Langhryðjuferð til USA/Asíu',
    typicalDays: 14,
    estimatedCosts: {
      transportation: { min: 150000, max: 300000 },
      accommodation: { min: 210000, max: 560000 }, // 15k-40k/nótt × 14
      foodPerDay: { min: 10000, max: 20000 },
      activities: { min: 50000, max: 150000 },
      localTransport: { min: 30000, max: 80000 },
      other: { min: 20000, max: 50000 },
    },
  },
];
```

---

## Íhlutir (Components)

### 1. TravelVacationPage (Parent Component)

**Ábyrgð**:
- Heldur utan um state fyrir alla síðuna
- Sækir calculatorData (actualHourlyWage, FI data) úr CalculatorContext
- Renders child components
- Handles localStorage persistence

**Props**: Engar (top-level page)

**State**:
```typescript
const [state, setState] = useState<TravelVacationState>(INITIAL_STATE);
const [result, setResult] = useState<TripCalculationResult | null>(null);
const [comparison, setComparison] = useState<TripComparison | null>(null);
```

**Lykilaðgerðir**:
- Load state from localStorage on mount
- Calculate results when inputs change (debounced)
- Save state to localStorage (debounced)
- Toggle comparison mode
- Apply preset

**Render skipulag**:
```tsx
<div className="container">
  <PageHeader
    title="Ferða- og Frístundakostnaður"
    subtitle="Sjáðu raunverulegan kostnað ferða í lífsorku"
  />

  {!calculatorData.actualHourlyWage ? (
    <MissingDataWarning
      message="Þú þarft að fylla út Raunverulegt Tímakaup fyrst"
      linkTo="/actual-hourly-wage"
    />
  ) : (
    <>
      <TripInputSection
        trip={state.mainTrip}
        settings={state.settings}
        onTripChange={handleTripChange}
        onSettingsChange={handleSettingsChange}
        onApplyPreset={handleApplyPreset}
      />

      {result && (
        <TripResultsSection
          result={result}
          showStaycation={state.settings.showStaycationComparison}
        />
      )}

      <ComparisonToggle
        enabled={state.showComparison}
        onToggle={handleToggleComparison}
      />

      {state.showComparison && (
        <ComparisonSection
          mainTrip={state.mainTrip}
          comparisonTrips={state.comparisonTrips}
          onTripsChange={handleComparisonTripsChange}
        />
      )}

      {comparison && (
        <ComparisonResultsSection comparison={comparison} />
      )}

      <ActionButtons
        onClear={handleClear}
        onExport={handleExport}
      />
    </>
  )}
</div>
```

---

### 2. TripInputSection

**Ábyrgð**:
- Input fyrir ferðarupplýsingar og kostnað
- Forstillingar valgluggi
- Stillingar (ávöxtunarkrafa, staycation)

**Props**:
```typescript
interface TripInputSectionProps {
  trip: TripInput;
  settings: TravelCalculationSettings;
  onTripChange: (trip: TripInput) => void;
  onSettingsChange: (settings: TravelCalculationSettings) => void;
  onApplyPreset: (preset: TripPreset) => void;
}
```

**Render skipulag**:
```tsx
<Card>
  <CardHeader>Upplýsingar um ferð</CardHeader>
  <CardBody>
    {/* Preset selector */}
    <PresetSelector
      presets={TRIP_PRESETS}
      onSelect={onApplyPreset}
    />

    <Divider />

    {/* Trip details */}
    <FormField
      label="Heiti ferðar (valfrjálst)"
      type="text"
      value={trip.details.name || ''}
      onChange={(value) => handleDetailsChange({ name: value })}
      placeholder="t.d. Spánarferð júlí 2026"
    />

    <FormField
      label="Lengd ferðar (dagar)"
      type="number"
      value={trip.details.days}
      onChange={(value) => handleDetailsChange({ days: value })}
      min={1}
      max={90}
      required
    />

    <FormField
      label="Áfangastaður (valfrjálst)"
      type="text"
      value={trip.details.destination || ''}
      onChange={(value) => handleDetailsChange({ destination: value })}
      placeholder="t.d. Barcelona"
    />

    <Divider />

    {/* Cost inputs */}
    <CostInputs
      costs={trip.costs}
      days={trip.details.days}
      onCostsChange={handleCostsChange}
    />

    <Divider />

    {/* Settings */}
    <FormField
      label="Vænt ávöxtun"
      type="number"
      value={settings.expectedReturnRate * 100}
      onChange={(value) => handleSettingsChange({
        ...settings,
        expectedReturnRate: value / 100
      })}
      min={0}
      max={15}
      step={0.5}
      suffix="%"
      helpText="Sjálfgefið 7% miðast við langtíma hlutabréfaávöxtun"
    />

    <ToggleField
      label="Bera saman við að vera heima (staycation)"
      checked={settings.showStaycationComparison}
      onChange={(checked) => handleSettingsChange({
        ...settings,
        showStaycationComparison: checked
      })}
    />

    {settings.showStaycationComparison && (
      <FormField
        label="Daglegur kostnaður ef heima (kr/dag)"
        type="number"
        value={settings.staycationDailyCost}
        onChange={(value) => handleSettingsChange({
          ...settings,
          staycationDailyCost: value
        })}
        min={0}
        placeholder="0"
        helpText="T.d. áætlaður matarkostnaður heima"
      />
    )}
  </CardBody>
</Card>
```

---

### 3. CostInputs (Sub-component)

**Ábyrgð**:
- Input fyrir alla kostnaðarliði
- Sundurliðun eftir flokkum
- Sýna heildarkostnað real-time

**Props**:
```typescript
interface CostInputsProps {
  costs: TripCosts;
  days: number;
  onCostsChange: (costs: TripCosts) => void;
}
```

**Render skipulag**:
```tsx
<div className="cost-inputs">
  <h3>Kostnaðarliðir</h3>

  <FormField
    label="Flug / Samgöngur"
    type="number"
    value={costs.transportation}
    onChange={(value) => handleCostChange('transportation', value)}
    min={0}
    suffix="kr"
    icon={<PlaneIcon />}
  />

  <FormField
    label="Gisting (heildar)"
    type="number"
    value={costs.accommodation}
    onChange={(value) => handleCostChange('accommodation', value)}
    min={0}
    suffix="kr"
    icon={<HotelIcon />}
    helpText={`${days - 1} nætur`}
  />

  <FormField
    label="Matur á dag"
    type="number"
    value={costs.foodPerDay}
    onChange={(value) => handleCostChange('foodPerDay', value)}
    min={0}
    suffix="kr/dag"
    icon={<RestaurantIcon />}
    helpText={`Heildar: ${formatCurrency(costs.foodPerDay * days)}`}
  />

  <FormField
    label="Afþreying / Athafnir"
    type="number"
    value={costs.activities}
    onChange={(value) => handleCostChange('activities', value)}
    min={0}
    suffix="kr"
    icon={<ActivityIcon />}
  />

  <FormField
    label="Staðbundnar samgöngur"
    type="number"
    value={costs.localTransport}
    onChange={(value) => handleCostChange('localTransport', value)}
    min={0}
    suffix="kr"
    icon={<CarIcon />}
    helpText="Bílaleiga, leigubílar, almenningssamgöngur"
  />

  <FormField
    label="Annað"
    type="number"
    value={costs.other}
    onChange={(value) => handleCostChange('other', value)}
    min={0}
    suffix="kr"
  />

  <TotalCostPreview
    costs={costs}
    days={days}
  />
</div>
```

---

### 4. PresetSelector

**Ábyrgð**:
- Sýna lista af forstillingum
- Leyfa notanda að velja
- Preview af áætluðum kostnaði

**Props**:
```typescript
interface PresetSelectorProps {
  presets: TripPreset[];
  onSelect: (preset: TripPreset) => void;
}
```

**Render skipulag**:
```tsx
<div className="preset-selector">
  <Label>Fljótlegar forstillingar</Label>

  <div className="preset-grid">
    {presets.map((preset) => (
      <PresetCard
        key={preset.name}
        preset={preset}
        onClick={() => onSelect(preset)}
      />
    ))}
  </div>

  <HelpText>
    Veldu forstillingu til að fylla út eyðublað með dæmigerðum gildum.
    Þú getur breytt öllum gildum eftir á.
  </HelpText>
</div>
```

---

### 5. TripResultsSection

**Ábyrgð**:
- Sýna allar niðurstöður fyrir ferð
- Delegate til undircomponents

**Props**:
```typescript
interface TripResultsSectionProps {
  result: TripCalculationResult;
  showStaycation: boolean;
}
```

**Render skipulag**:
```tsx
<div className="results-grid">
  <TotalCostCard totalCost={result.totalCost} />

  <LifeEnergyCard lifeEnergyCost={result.lifeEnergyCost} />

  <OpportunityCostCard opportunityCost={result.opportunityCost} />

  {showStaycation && result.staycationComparison && (
    <StaycationComparisonCard
      comparison={result.staycationComparison}
    />
  )}

  {result.fiImpact && (
    <FIImpactCard fiImpact={result.fiImpact} />
  )}
</div>
```

---

### 6. TotalCostCard

**Ábyrgð**:
- Sýna heildarkostnað með sundurliðun
- Kostnaður á dag

**Props**:
```typescript
interface TotalCostCardProps {
  totalCost: TotalCostBreakdown;
}
```

**Render skipulag**:
```tsx
<Card className="total-cost-card">
  <CardHeader icon={<CurrencyIcon />}>
    Heildarkostnaður ferðar
  </CardHeader>
  <CardBody>
    <BigNumber
      value={totalCost.total}
      unit="kr"
      className="primary-result"
    />

    <SecondaryMetric
      label="Kostnaður á dag"
      value={formatCurrency(totalCost.costPerDay)}
    />

    <Divider />

    <CostBreakdownList breakdown={totalCost.breakdown} />
  </CardBody>
</Card>
```

---

### 7. LifeEnergyCard

**Ábyrgð**:
- Sýna lífsorgu kostnað
- Klukkustundir, dagar, vikur
- Kostnaður á ferðadag

**Props**:
```typescript
interface LifeEnergyCardProps {
  lifeEnergyCost: LifeEnergyCost;
}
```

**Render skipulag**:
```tsx
<Card className="life-energy-card">
  <CardHeader icon={<ClockIcon />}>
    Lífsorgu kostnaður
  </CardHeader>
  <CardBody>
    <BigNumber
      value={lifeEnergyCost.totalHours}
      unit="klukkustundir"
      className="primary-result"
    />

    <SecondaryMetric
      label="Það samsvarar"
      value={lifeEnergyCost.formattedString}
    />

    <SecondaryMetric
      label="Kostnaður á ferðadag"
      value={`${lifeEnergyCost.hoursPerTripDay.toFixed(1)} klst/dag`}
    />

    <HelpText>
      Til að vinna sér inn kostnað þessarar ferðar þarft þú að vinna í{' '}
      {lifeEnergyCost.formattedString}.
    </HelpText>
  </CardBody>
</Card>
```

---

### 8. OpportunityCostCard

**Ábyrgð**:
- Sýna tækifæriskostnað (framtíðarvirði)
- Fyrir öll tímabil
- Tækifæriskostnaður á dag

**Props**:
```typescript
interface OpportunityCostCardProps {
  opportunityCost: OpportunityCost;
}
```

**Render skipulag**:
```tsx
<Card className="opportunity-cost-card">
  <CardHeader icon={<TrendingUpIcon />}>
    Tækifæriskostnaður
  </CardHeader>
  <CardBody>
    <HelpText>
      Ef þú fjárfestir ferðakostnaðinn í staðinn:
    </HelpText>

    {opportunityCost.futureValues.map((fv) => (
      <FutureValueRow key={fv.years}>
        <Label>Eftir {fv.years} ár:</Label>
        <Value>{fv.formattedValue}</Value>
      </FutureValueRow>
    ))}

    <Divider />

    <SecondaryMetric
      label="Tækifæriskostnaður á ferðadag (20 ár)"
      value={formatCurrency(opportunityCost.opportunityCostPerDay)}
    />

    <Insight>
      Þetta er munurinn á því að eyða peningunum núna á móti því að fjárfesta þá
      fyrir fjárhagslegt frelsi.
    </Insight>
  </CardBody>
</Card>
```

---

### 9. StaycationComparisonCard

**Ábyrgð**:
- Sýna samanburð við að vera heima
- Aukakostnaður ferðar

**Props**:
```typescript
interface StaycationComparisonCardProps {
  comparison: StaycationComparison;
}
```

**Render skipulag**:
```tsx
<Card className="staycation-comparison-card">
  <CardHeader icon={<HomeIcon />}>
    Samanburður við að vera heima
  </CardHeader>
  <CardBody>
    <MetricRow>
      <Label>Kostnaður að vera heima:</Label>
      <Value>{formatCurrency(comparison.staycationTotalCost)}</Value>
    </MetricRow>

    <MetricRow>
      <Label>Aukakostnaður ferðar:</Label>
      <Value className="highlight">
        {formatCurrency(comparison.additionalCostToTravel)}
      </Value>
    </MetricRow>

    <MetricRow>
      <Label>Í lífsorgu:</Label>
      <Value>
        {comparison.additionalLifeEnergyHours.toFixed(1)} klukkustundir
      </Value>
    </MetricRow>

    <Insight positive>
      {comparison.formattedSummary}
    </Insight>
  </CardBody>
</Card>
```

---

### 10. FIImpactCard

**Ábyrgð**:
- Sýna áhrif á FI tímalínu
- Töf á FI dagsetningu
- Fjöldi ferða sem tefur 1 mánuð

**Props**:
```typescript
interface FIImpactCardProps {
  fiImpact: FIImpact;
}
```

**Render skipulag**:
```tsx
<Card className="fi-impact-card">
  <CardHeader icon={<CalendarIcon />}>
    Áhrif á fjárhagslegt frelsi
  </CardHeader>
  <CardBody>
    <BigNumber
      value={fiImpact.delayMonths}
      unit={fiImpact.delayMonths === 1 ? 'mánuður' : 'mánuðir'}
      label="Töf á FI dagsetningu"
    />

    <SecondaryMetric
      label="Í vinnudögum"
      value={`${Math.round(fiImpact.delayDays / 5)} vinnudagar`}
    />

    <Divider />

    <Insight positive>
      Ef þú sleppur þessari ferð, nærðu fjárhagslegu frelsi{' '}
      {fiImpact.formattedDelay} fyrr.
    </Insight>

    <HelpText>
      Athugið: {fiImpact.tripsPerMonthDelay.toFixed(1)} slíkar ferðir á ári
      tefja FI um 1 mánuð.
    </HelpText>
  </CardBody>
</Card>
```

---

### 11. ComparisonSection

**Ábyrgð**:
- Leyfa notanda að bæta við 2-3 ferðavalkostum
- Input fyrir hvern valkost

**Props**:
```typescript
interface ComparisonSectionProps {
  mainTrip: TripInput;
  comparisonTrips: TripInput[];
  onTripsChange: (trips: TripInput[]) => void;
}
```

**Render skipulag**:
```tsx
<Card>
  <CardHeader>Bera saman ferðavalkosti</CardHeader>
  <CardBody>
    <TripOptionInput
      label="Valkostur 1 (aðalferð)"
      trip={mainTrip}
      disabled
    />

    {[0, 1].map((index) => (
      <TripOptionInput
        key={index}
        label={`Valkostur ${index + 2}`}
        trip={comparisonTrips[index] || INITIAL_TRIP_INPUT}
        onChange={(trip) => handleTripChange(index, trip)}
        onRemove={() => handleRemoveTrip(index)}
      />
    ))}

    {comparisonTrips.length < 2 && (
      <Button onClick={handleAddTrip}>
        Bæta við valkosti
      </Button>
    )}
  </CardBody>
</Card>
```

---

### 12. ComparisonResultsSection

**Ábyrgð**:
- Sýna samanburð á öllum valkostum
- Highlight ódýrasta
- Sýna sparnaður

**Props**:
```typescript
interface ComparisonResultsSectionProps {
  comparison: TripComparison;
}
```

**Render skipulag**:
```tsx
<Card className="comparison-results">
  <CardHeader>Samanburður ferða</CardHeader>
  <CardBody>
    <ResponsiveComparisonTable>
      <TableHeader>
        <th></th>
        {comparison.trips.map((trip, idx) => (
          <th key={idx}>
            {trip.input.details.name || `Valkostur ${idx + 1}`}
            {idx === comparison.cheapestTripIndex && (
              <Badge variant="success">Ódýrastur</Badge>
            )}
          </th>
        ))}
      </TableHeader>
      <TableBody>
        <TableRow label="Lengd">
          {comparison.trips.map((trip, idx) => (
            <td key={idx}>{trip.input.details.days} dagar</td>
          ))}
        </TableRow>

        <TableRow label="Heildarkostnaður">
          {comparison.trips.map((trip, idx) => (
            <td key={idx}>{formatCurrency(trip.totalCost.total)}</td>
          ))}
        </TableRow>

        <TableRow label="Lífsorgu klukkustundir">
          {comparison.trips.map((trip, idx) => (
            <td key={idx}>{trip.lifeEnergyCost.totalHours.toFixed(1)} klst</td>
          ))}
        </TableRow>

        <TableRow label="Kostnaður á dag">
          {comparison.trips.map((trip, idx) => (
            <td key={idx}>{formatCurrency(trip.totalCost.costPerDay)}</td>
          ))}
        </TableRow>

        <TableRow label="Tækifæriskostnaður (20 ár)">
          {comparison.trips.map((trip, idx) => {
            const fv20 = trip.opportunityCost.futureValues.find(fv => fv.years === 20);
            return <td key={idx}>{fv20?.formattedValue}</td>;
          })}
        </TableRow>
      </TableBody>
    </ResponsiveComparisonTable>

    <ComparisonInsights
      cheapestTrip={comparison.trips[comparison.cheapestTripIndex]}
      savings={comparison.savingsWithCheapest}
      maxDifference={comparison.maxLifeEnergyDifference}
    />
  </CardBody>
</Card>
```

---

## Útreikningsvirkni

### 1. calculateTotalCost()

```typescript
/**
 * Reiknar heildarkostnað ferðar með sundurliðun
 */
function calculateTotalCost(
  costs: TripCosts,
  days: number
): TotalCostBreakdown {
  const foodTotal = costs.foodPerDay * days;

  const total =
    costs.transportation +
    costs.accommodation +
    foodTotal +
    costs.activities +
    costs.localTransport +
    costs.other;

  const costPerDay = total / days;

  return {
    total,
    breakdown: {
      transportation: costs.transportation,
      accommodation: costs.accommodation,
      food: foodTotal,
      activities: costs.activities,
      localTransport: costs.localTransport,
      other: costs.other,
    },
    costPerDay,
  };
}
```

---

### 2. calculateLifeEnergyCost()

```typescript
/**
 * Reiknar lífsorgu kostnað ferðar
 */
function calculateLifeEnergyCost(
  totalCost: number,
  actualHourlyWage: number,
  tripDays: number
): LifeEnergyCost {
  const totalHours = totalCost / actualHourlyWage;
  const workDays = totalHours / 8;
  const workWeeks = totalHours / 40;
  const hoursPerTripDay = totalHours / tripDays;

  const formattedString = formatLifeEnergy(totalHours);

  return {
    totalHours,
    workDays,
    workWeeks,
    hoursPerTripDay,
    formattedString,
  };
}

/**
 * Formats klukkustundir í læsilegan streng
 */
function formatLifeEnergy(hours: number): string {
  const weeks = Math.floor(hours / 40);
  const remainingHours = hours % 40;
  const days = Math.floor(remainingHours / 8);
  const finalHours = Math.floor(remainingHours % 8);

  const parts: string[] = [];

  if (weeks > 0) {
    parts.push(`${weeks} ${weeks === 1 ? 'vika' : 'vikur'}`);
  }

  if (days > 0) {
    parts.push(`${days} ${days === 1 ? 'dagur' : 'dagar'}`);
  }

  if (finalHours > 0 || parts.length === 0) {
    parts.push(`${finalHours} ${finalHours === 1 ? 'klukkustund' : 'klukkustundir'}`);
  }

  return parts.join(' og ');
}
```

---

### 3. calculateOpportunityCost()

```typescript
/**
 * Reiknar tækifæriskostnað (framtíðarvirði)
 */
function calculateOpportunityCost(
  totalCost: number,
  settings: TravelCalculationSettings,
  tripDays: number
): OpportunityCost {
  const futureValues = settings.futureValueYears.map((years) => {
    const value = calculateFutureValue(
      totalCost,
      settings.expectedReturnRate,
      years
    );

    return {
      years,
      value,
      formattedValue: formatCurrency(value),
    };
  });

  // Tækifæriskostnaður á dag = 20 ára framtíðarvirði / lengd ferðar
  const fv20 = futureValues.find(fv => fv.years === 20);
  const opportunityCostPerDay = fv20 ? fv20.value / tripDays : 0;

  return {
    futureValues,
    opportunityCostPerDay,
  };
}

/**
 * Reiknar framtíðarvirði
 */
function calculateFutureValue(
  presentValue: number,
  annualReturnRate: number,
  years: number
): number {
  return presentValue * Math.pow(1 + annualReturnRate, years);
}
```

---

### 4. calculateStaycationComparison()

```typescript
/**
 * Reiknar samanburð við að vera heima
 */
function calculateStaycationComparison(
  totalTripCost: number,
  staycationDailyCost: number,
  tripDays: number,
  actualHourlyWage: number
): StaycationComparison {
  const staycationTotalCost = staycationDailyCost * tripDays;
  const additionalCostToTravel = totalTripCost - staycationTotalCost;
  const additionalLifeEnergyHours = additionalCostToTravel / actualHourlyWage;

  const formattedSummary = `Þú borgir ${formatCurrency(additionalCostToTravel)} (${additionalLifeEnergyHours.toFixed(1)} klukkustundir) aukalega til að ferðast.`;

  return {
    staycationTotalCost,
    additionalCostToTravel,
    additionalLifeEnergyHours,
    formattedSummary,
  };
}
```

---

### 5. calculateFIImpact()

```typescript
/**
 * Reiknar áhrif á FI tímalínu
 */
function calculateFIImpact(
  totalCost: number,
  lifeEnergyCost: LifeEnergyCost,
  fiData?: RequiredCalculatorData['fiData']
): FIImpact | undefined {
  if (!fiData || !fiData.annualSavings || fiData.annualSavings <= 0) {
    return undefined;
  }

  const additionalWorkHours = lifeEnergyCost.totalHours;

  // Töf í árum
  const delayYears = totalCost / fiData.annualSavings;
  const delayDays = Math.round(delayYears * 365);
  const delayMonths = Math.round(delayYears * 12);

  // Fjöldi ferða sem tefur FI um 1 mánuð
  const monthlySavings = fiData.annualSavings / 12;
  const tripsPerMonthDelay = monthlySavings / totalCost;

  const formattedDelay = formatDelay(delayMonths);

  return {
    additionalWorkHours,
    delayDays,
    delayMonths,
    tripsPerMonthDelay,
    formattedDelay,
  };
}

/**
 * Format delay í læsilegan streng
 */
function formatDelay(months: number): string {
  if (months < 1) {
    return 'minna en mánuð';
  }

  if (months < 12) {
    return `${months} ${months === 1 ? 'mánuður' : 'mánuðir'}`;
  }

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (remainingMonths === 0) {
    return `${years} ${years === 1 ? 'ár' : 'ár'}`;
  }

  return `${years} ${years === 1 ? 'ár' : 'ár'} og ${remainingMonths} ${remainingMonths === 1 ? 'mánuður' : 'mánuðir'}`;
}
```

---

### 6. calculateTripResult() (Master Function)

```typescript
/**
 * Aðalútreikningsvirkni - reiknar allar niðurstöður fyrir eina ferð
 */
function calculateTripResult(
  trip: TripInput,
  calculatorData: RequiredCalculatorData,
  settings: TravelCalculationSettings
): TripCalculationResult {
  if (!calculatorData.actualHourlyWage) {
    throw new Error('actualHourlyWage is required');
  }

  if (trip.details.days <= 0) {
    throw new Error('Trip days must be greater than 0');
  }

  // 1. Heildarkostnaður
  const totalCost = calculateTotalCost(trip.costs, trip.details.days);

  // 2. Lífsorgu kostnaður
  const lifeEnergyCost = calculateLifeEnergyCost(
    totalCost.total,
    calculatorData.actualHourlyWage,
    trip.details.days
  );

  // 3. Tækifæriskostnaður
  const opportunityCost = calculateOpportunityCost(
    totalCost.total,
    settings,
    trip.details.days
  );

  // 4. Staycation samanburður (ef virkjað)
  let staycationComparison: StaycationComparison | undefined;
  if (settings.showStaycationComparison) {
    staycationComparison = calculateStaycationComparison(
      totalCost.total,
      settings.staycationDailyCost,
      trip.details.days,
      calculatorData.actualHourlyWage
    );
  }

  // 5. FI áhrif (ef gögn til staðar)
  const fiImpact = calculateFIImpact(
    totalCost.total,
    lifeEnergyCost,
    calculatorData.fiData
  );

  return {
    input: trip,
    totalCost,
    lifeEnergyCost,
    opportunityCost,
    staycationComparison,
    fiImpact,
  };
}
```

---

### 7. compareTrips()

```typescript
/**
 * Ber saman marga ferðavalkosti
 */
function compareTrips(
  trips: TripInput[],
  calculatorData: RequiredCalculatorData,
  settings: TravelCalculationSettings
): TripComparison {
  if (!calculatorData.actualHourlyWage) {
    throw new Error('actualHourlyWage is required for comparison');
  }

  // Reikna niðurstöður fyrir hverja ferð
  const results = trips.map((trip) =>
    calculateTripResult(trip, calculatorData, settings)
  );

  // Finna ódýrasta ferðina
  const cheapestTripIndex = results.reduce((minIdx, result, idx, arr) =>
    result.totalCost.total < arr[minIdx].totalCost.total
      ? idx
      : minIdx,
    0
  );

  // Reikna hámarks mun
  const costs = results.map(r => r.totalCost.total);
  const lifeEnergyHours = results.map(r => r.lifeEnergyCost.totalHours);

  const maxCost = Math.max(...costs);
  const minCost = Math.min(...costs);
  const maxLifeEnergy = Math.max(...lifeEnergyHours);
  const minLifeEnergy = Math.min(...lifeEnergyHours);

  const maxLifeEnergyDifference = maxLifeEnergy - minLifeEnergy;

  const savingsWithCheapest = {
    currency: maxCost - minCost,
    lifeEnergyHours: maxLifeEnergyDifference,
  };

  return {
    trips: results,
    cheapestTripIndex,
    maxLifeEnergyDifference,
    savingsWithCheapest,
  };
}
```

---

### 8. applyPreset()

```typescript
/**
 * Nota forstillingu til að fylla út form
 */
function applyPreset(preset: TripPreset): TripInput {
  // Nota miðgildi fyrir allar upphæðir
  const costs: TripCosts = {
    transportation: getMidpoint(preset.estimatedCosts.transportation),
    accommodation: getMidpoint(preset.estimatedCosts.accommodation),
    foodPerDay: getMidpoint(preset.estimatedCosts.foodPerDay),
    activities: getMidpoint(preset.estimatedCosts.activities),
    localTransport: getMidpoint(preset.estimatedCosts.localTransport),
    other: getMidpoint(preset.estimatedCosts.other),
  };

  return {
    details: {
      name: preset.name,
      days: preset.typicalDays,
      destination: '',
    },
    costs,
  };
}

/**
 * Finnur miðpunkt á milli min og max
 */
function getMidpoint(range: { min: number; max: number }): number {
  return Math.round((range.min + range.max) / 2);
}
```

---

## Gagnaþrautseigja (Data Persistence)

### localStorage Strategy

```typescript
const STORAGE_KEY = 'travelVacation_state';

/**
 * Vista state í localStorage
 */
function saveToLocalStorage(state: TravelVacationState): void {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

/**
 * Sækja state úr localStorage
 */
function loadFromLocalStorage(): TravelVacationState | null {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;

    return JSON.parse(serialized) as TravelVacationState;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
}

/**
 * Hreinsa gögn
 */
function clearLocalStorage(): void {
  localStorage.removeItem(STORAGE_KEY);
}
```

### Debouncing Strategy

```typescript
import { useDebouncedCallback } from 'use-debounce';

// In component:
const debouncedSave = useDebouncedCallback(
  (state: TravelVacationState) => {
    saveToLocalStorage(state);
  },
  500 // 500ms delay
);

// Nota í useEffect:
useEffect(() => {
  debouncedSave(state);
}, [state, debouncedSave]);
```

---

## Villuhöndlun

### Validation Rules

```typescript
/**
 * Validation fyrir trip input
 */
function validateTripInput(trip: TripInput): ValidationResult {
  const errors: string[] = [];

  if (trip.details.days <= 0) {
    errors.push('Lengd ferðar verður að vera að minnsta kosti 1 dagur');
  }

  if (trip.details.days > 90) {
    errors.push('Lengd ferðar verður að vera 90 dagar eða minna');
  }

  if (trip.details.name && trip.details.name.length > 100) {
    errors.push('Heiti má vera að hámarki 100 stafir');
  }

  // Check if at least some costs are entered
  const totalCost = Object.values(trip.costs).reduce((sum, cost) => sum + cost, 0);
  if (totalCost === 0) {
    errors.push('Sláðu inn að minnsta kosti einn kostnaðarlið');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validation fyrir settings
 */
function validateSettings(settings: TravelCalculationSettings): ValidationResult {
  const errors: string[] = [];

  if (settings.expectedReturnRate < 0 || settings.expectedReturnRate > 0.15) {
    errors.push('Ávöxtunarkrafa verður að vera á milli 0% og 15%');
  }

  if (settings.staycationDailyCost < 0) {
    errors.push('Staycation kostnaður getur ekki verið neikvæður');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
```

---

## Prófunarstefna

### Unit Tests

```typescript
describe('calculateTotalCost', () => {
  test('reiknar rétt heildarkostnað', () => {
    const costs: TripCosts = {
      transportation: 60000,
      accommodation: 120000,
      foodPerDay: 10000,
      activities: 30000,
      localTransport: 15000,
      other: 10000,
    };
    const days = 5;

    const result = calculateTotalCost(costs, days);

    expect(result.total).toBe(285000);
    expect(result.breakdown.food).toBe(50000); // 10k × 5
    expect(result.costPerDay).toBe(57000);
  });
});

describe('calculateLifeEnergyCost', () => {
  test('reiknar rétt lífsorgu kostnað', () => {
    const result = calculateLifeEnergyCost(285000, 4500, 5);

    expect(result.totalHours).toBeCloseTo(63.33, 1);
    expect(result.workDays).toBeCloseTo(7.92, 1);
    expect(result.hoursPerTripDay).toBeCloseTo(12.67, 1);
  });
});

describe('calculateStaycationComparison', () => {
  test('reiknar rétt aukakostnað', () => {
    const result = calculateStaycationComparison(285000, 3000, 5, 4500);

    expect(result.staycationTotalCost).toBe(15000);
    expect(result.additionalCostToTravel).toBe(270000);
    expect(result.additionalLifeEnergyHours).toBe(60);
  });
});

describe('calculateFIImpact', () => {
  test('reiknar rétta töf', () => {
    const lifeEnergyCost = {
      totalHours: 63,
      workDays: 7.9,
      workWeeks: 1.6,
      hoursPerTripDay: 12.6,
      formattedString: '',
    };
    const fiData = { annualSavings: 1500000 };

    const result = calculateFIImpact(285000, lifeEnergyCost, fiData);

    expect(result).toBeDefined();
    expect(result!.delayMonths).toBeCloseTo(2, 0);
    expect(result!.tripsPerMonthDelay).toBeCloseTo(0.44, 1);
  });
});

describe('applyPreset', () => {
  test('fyllar út form með miðgildum', () => {
    const preset = TRIP_PRESETS[0]; // Helgarferð til Evrópu
    const result = applyPreset(preset);

    expect(result.details.days).toBe(4);
    expect(result.costs.transportation).toBeGreaterThan(0);
    expect(result.details.name).toBe(preset.name);
  });
});
```

### Integration Tests

```typescript
describe('TravelVacationPage Integration', () => {
  test('reiknar rétt þegar öll gögn gild', () => {
    const calculatorData = {
      actualHourlyWage: 4500,
      fiData: { annualSavings: 1500000 },
    };
    const trip: TripInput = {
      details: { name: 'Tesferð', days: 5, destination: 'Barcelona' },
      costs: {
        transportation: 60000,
        accommodation: 120000,
        foodPerDay: 10000,
        activities: 30000,
        localTransport: 15000,
        other: 10000,
      },
    };
    const settings = DEFAULT_SETTINGS;

    const result = calculateTripResult(trip, calculatorData, settings);

    expect(result.totalCost.total).toBe(285000);
    expect(result.lifeEnergyCost.totalHours).toBeCloseTo(63.33, 1);
    expect(result.opportunityCost.futureValues).toHaveLength(3);
    expect(result.fiImpact).toBeDefined();
  });
});
```

---

## Hönnunarákvarðanir

### 1. Client-Side Only Calculations

**Ákvörðun**: Allir útreikningar gerðir á client-side, engin API köll.

**Rökstuðningur**:
- Privacy-first approach
- Hraðari - engin network latency
- Einfaldari arkitektúr

### 2. Forstillingar fyrir íslenskar ferðir

**Ákvörðun**: Harðkóða forstillingar með algengum ferðum frá Íslandi.

**Valkostir**:
- A) Harðkóðaðar forstillingar (valið)
- B) API kallað fyrir live verð
- C) Engar forstillingar

**Rökstuðningur**:
- Fljótlegra að nota fyrir notendur
- Gefur góðan upphafspunkt
- Engar external dependencies
- Privacy-friendly

**Trade-offs**:
- Verð geta breyst - disclaimer nauðsynlegur

### 3. Staycation samanburður sem opt-in

**Ákvörðun**: Staycation toggle er sjálfgefið slökkt.

**Rökstuðningur**:
- UI einfaldara fyrir flesta notendur
- Ekki allir vilja sjá þetta
- Auðvelt að kveikja ef áhugi

### 4. FI Impact Calculation einföld

**Ákvörðun**: Notum einfalda formúlu (totalCost / annualSavings).

**Rökstuðningur**:
- "Good enough" nálgun
- Einfalt að skilja
- Fullkomin simulation krefst fleiri forsenda

### 5. Comparison Mode Toggle

**Ákvörðun**: Samanburður er ekki sjálfgefið sýnilegur.

**Rökstuðningur**:
- Flestir vilja bara meta eina ferð
- Cleaner UI
- Power users geta kveikt

---

## Framtíðar útfærslumöguleikar

### Phase 2 Enhancements

1. **Ferðasaga**: Vista allar ferðir og sjá mynstur yfir tíma
2. **Árleg ferðaáætlun**: "Ég vil fara á X ferðir - hvernig passar það við FI?"
3. **"Var þetta þess virði?" review**: 3-6 mánuðum eftir ferð
4. **Ferðasparnunartól**: Reikna mánaðarlegan sparnað fyrir draumaferð

### Phase 3 Enhancements

1. **Live price lookups**: Integration með bókunarsíðum (með privacy)
2. **Currency conversion**: Automatic gjaldeyriskostnaður
3. **Seasonal pricing**: Sýna hvernig verð breytist eftir árstíma
4. **CO2 footprint**: Umhverfisáhrif (optional)

---

## Samantekt

Þetta hönnunarskjal skilgreinir fullkomlega hvernig Ferða- og Frístundakostnaðarreiknivél virkar:

- **Gagnalíkön** eru skýr með TypeScript interfaces
- **Íhlutir** eru vel skilgreindir með ábyrgðum og props
- **Útreikningar** eru nákvæmir með formúlum
- **Forstillingar** gera tólið auðvelt í notkun
- **Samanburður** leyfir power users að meta valkosti
- **FI integration** tengir við stærra FIRE markmið

Tólið fylgir privacy-first hugmyndafræði appsins og notar sömu UI patterns og aðrir reiknivélar.
