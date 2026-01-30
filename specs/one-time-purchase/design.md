# Hönnun: Einstakskaupaverkfæri (One-Time Purchase Decision Tool)

## Yfirlit

**Eiginleiki**: Einstakskaupaverkfæri
**Hönnunarfasi**: Tæknilegt hönnunarskjal
**Tengist kröfulýsingu**: `/specs/one-time-purchase/requirements.md`

## Arkitektúr

### Kerfisskipan

```
┌─────────────────────────────────────────────────────────┐
│                   React Component Layer                 │
│  ┌───────────────────────────────────────────────────┐  │
│  │  OneTimePurchasePage                              │  │
│  │  ┌─────────────────┐  ┌─────────────────────────┐ │  │
│  │  │ PurchaseInput   │  │ PurchaseResults         │ │  │
│  │  │ Component       │  │ Component               │ │  │
│  │  │                 │  │ - LifeEnergyDisplay     │ │  │
│  │  │ - Purchase form │  │ - OpportunityCostDisplay│ │  │
│  │  │ - Settings      │  │ - FIImpactDisplay       │ │  │
│  │  │                 │  │   (conditional)         │ │  │
│  │  └─────────────────┘  └─────────────────────────┘ │  │
│  │                                                    │  │
│  │  ┌──────────────────────────────────────────────┐ │  │
│  │  │ ComparisonView (optional)                    │ │  │
│  │  │ - Up to 3 purchase options side-by-side     │ │  │
│  │  └──────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                  Calculation Engine                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │  oneTimePurchaseCalculations.ts                   │  │
│  │  - calculateLifeEnergyCost()                      │  │
│  │  - calculateFutureValue()                         │  │
│  │  - calculateFIImpact()                            │  │
│  │  - compareOptions()                               │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    Data Layer                            │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Context/Store                                     │  │
│  │  - UserProfile (actualHourlyWage, FI data)        │  │
│  │  - OneTimePurchaseState                           │  │
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
User Input (Purchase Price)
         ↓
    Validation
         ↓
    State Update
         ↓
Calculate Life Energy Cost ← actualHourlyWage (from UserProfile)
         ↓
Calculate Future Value ← returnRate (from settings/defaults)
         ↓
Calculate FI Impact (optional) ← FI data (from UserProfile)
         ↓
    Render Results
         ↓
Save to localStorage (debounced)
```

## Gagnalíkön

### TypeScript Interfaces

```typescript
/**
 * Aðalinntaksgögn fyrir eitt kaup
 */
interface PurchaseInput {
  /** Kaupverð í íslenskum krónum */
  price: number;
  /** Valfrjálst heiti/lýsing á kaupunum */
  name?: string;
}

/**
 * Stillingar fyrir útreikninga
 */
interface PurchaseCalculationSettings {
  /** Vænt árleg ávöxtun fjárfestinga (0-1, t.d. 0.07 fyrir 7%) */
  expectedReturnRate: number;
  /** Tímabil í árum fyrir framtíðarvirði útreikninga */
  futureValueYears: number[];
}

/**
 * Niðurstöður lífsorgu útreikninga
 */
interface LifeEnergyCost {
  /** Heildar klukkustundir vinnu */
  totalHours: number;
  /** Vinnudagar (miðað við 8 klst dag) */
  workDays: number;
  /** Vinnuvikur (miðað við 40 klst viku) */
  workWeeks: number;
  /** Læsileg strengur formatering (t.d. "2 vikur og 3 dagar") */
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
 * Áhrif á FI tímalínu (valfrjálst)
 */
interface FIImpact {
  /** Auka vinnuklukkustundir til FI */
  additionalWorkHours: number;
  /** Töf á FI dagsetningu í dögum */
  delayDays: number;
  /** Töf í mánuðum (námundað) */
  delayMonths: number;
  /** Læsileg strengur formatering */
  formattedDelay: string;
}

/**
 * Heildniðurstöður fyrir eitt kaup
 */
interface PurchaseCalculationResult {
  /** Inntaksgögn */
  input: PurchaseInput;
  /** Lífsorgu kostnaður */
  lifeEnergyCost: LifeEnergyCost;
  /** Framtíðarvirði fyrir öll tímabil */
  futureValues: FutureValueResult[];
  /** FI áhrif (ef til staðar) */
  fiImpact?: FIImpact;
}

/**
 * Samanburður á mörgum kaupmöguleikum
 */
interface PurchaseComparison {
  /** Listi af niðurstöðum (2-3 valkostir) */
  options: PurchaseCalculationResult[];
  /** Index á ódýrasta valkostinum */
  cheapestOptionIndex: number;
  /** Mismunur á lífsorgu milli dýrasta og ódýrasta */
  maxLifeEnergyDifference: number;
}

/**
 * Vistaðar ástandar fyrir component
 */
interface OneTimePurchaseState {
  /** Aðalkaup sem verið er að skoða */
  mainPurchase: PurchaseInput;
  /** Samanburðar valkostir (0-2 viðbótar) */
  comparisonOptions: PurchaseInput[];
  /** Stillingar */
  settings: PurchaseCalculationSettings;
  /** Hvort sýna samanburðarham */
  showComparison: boolean;
}

/**
 * Gögn frá UserProfile sem þarf
 */
interface RequiredUserData {
  /** Raunverulegt tímakaup úr Actual Hourly Wage Calculator */
  actualHourlyWage: number | null;
  /** FI gögn (valfrjálst) */
  fiData?: {
    /** Árlegar sparnaður */
    annualSavings: number;
    /** Núverandi FI dagsetning (ef reiknuð) */
    fiDate?: Date;
  };
}
```

### Sjálfgefin gildi

```typescript
const DEFAULT_SETTINGS: PurchaseCalculationSettings = {
  expectedReturnRate: 0.07, // 7%
  futureValueYears: [10, 20, 30],
};

const INITIAL_STATE: OneTimePurchaseState = {
  mainPurchase: { price: 0, name: '' },
  comparisonOptions: [],
  settings: DEFAULT_SETTINGS,
  showComparison: false,
};
```

## Íhlutir (Components)

### 1. OneTimePurchasePage (Parent Component)

**Ábyrgð**:
- Heldur utan um state fyrir alla síðuna
- Sækir userData (actualHourlyWage, FI data) úr global context
- Renders child components
- Handles localStorage persistence

**Props**: Engar (top-level page)

**State**:
```typescript
const [state, setState] = useState<OneTimePurchaseState>(INITIAL_STATE);
const [results, setResults] = useState<PurchaseCalculationResult | null>(null);
const [comparisonResults, setComparisonResults] = useState<PurchaseComparison | null>(null);
```

**Lykilaðgerðir**:
- Load state from localStorage on mount
- Calculate results when inputs change (debounced)
- Save state to localStorage (debounced)
- Toggle comparison mode

**Render skipulag**:
```tsx
<div className="container">
  <PageHeader title="Einstakskaupaverkfæri" />

  {!userData.actualHourlyWage ? (
    <MissingDataWarning
      message="Þú þarft að fylla út Raunverulegt Tímakaup fyrst"
      linkTo="/actual-hourly-wage"
    />
  ) : (
    <>
      <PurchaseInputSection
        purchase={state.mainPurchase}
        settings={state.settings}
        onPurchaseChange={handlePurchaseChange}
        onSettingsChange={handleSettingsChange}
      />

      {results && (
        <PurchaseResultsSection
          results={results}
          userData={userData}
        />
      )}

      <ComparisonToggle
        enabled={state.showComparison}
        onToggle={handleToggleComparison}
      />

      {state.showComparison && (
        <ComparisonSection
          mainPurchase={state.mainPurchase}
          comparisonOptions={state.comparisonOptions}
          onOptionsChange={handleComparisonOptionsChange}
        />
      )}

      {comparisonResults && (
        <ComparisonResultsSection
          comparison={comparisonResults}
        />
      )}
    </>
  )}
</div>
```

---

### 2. PurchaseInputSection

**Ábyrgð**:
- Input fyrir kaupverð og nafn
- Stillingar fyrir ávöxtunarkröfu
- Validation og error messages

**Props**:
```typescript
interface PurchaseInputSectionProps {
  purchase: PurchaseInput;
  settings: PurchaseCalculationSettings;
  onPurchaseChange: (purchase: PurchaseInput) => void;
  onSettingsChange: (settings: PurchaseCalculationSettings) => void;
}
```

**Render skipulag**:
```tsx
<Card>
  <CardHeader>Upplýsingar um kaupin</CardHeader>
  <CardBody>
    <FormField
      label="Kaupverð (kr)"
      type="number"
      value={purchase.price}
      onChange={(value) => onPurchaseChange({ ...purchase, price: value })}
      placeholder="t.d. 2.000.000"
      required
    />

    <FormField
      label="Lýsing (valfrjálst)"
      type="text"
      value={purchase.name || ''}
      onChange={(value) => onPurchaseChange({ ...purchase, name: value })}
      placeholder="t.d. Nýr bíll"
    />

    <Divider />

    <FormField
      label="Vænt ávöxtun"
      type="number"
      value={settings.expectedReturnRate * 100}
      onChange={(value) => onSettingsChange({
        ...settings,
        expectedReturnRate: value / 100
      })}
      min={0}
      max={15}
      step={0.5}
      suffix="%"
      helpText="Sjálfgefið 7% miðast við langtíma hlutabréfaávöxtun"
    />
  </CardBody>
</Card>
```

---

### 3. PurchaseResultsSection

**Ábyrgð**:
- Sýna niðurstöður útreikninga
- Delegera til undircomponents fyrir hvern niðurstöðuhluta

**Props**:
```typescript
interface PurchaseResultsSectionProps {
  results: PurchaseCalculationResult;
  userData: RequiredUserData;
}
```

**Render skipulag**:
```tsx
<div className="results-grid">
  <LifeEnergyCard lifeEnergyCost={results.lifeEnergyCost} />

  <OpportunityCostCard
    futureValues={results.futureValues}
    purchasePrice={results.input.price}
  />

  {results.fiImpact && (
    <FIImpactCard fiImpact={results.fiImpact} />
  )}
</div>
```

---

### 4. LifeEnergyCard

**Ábyrgð**:
- Sýna lífsorgu kostnað á læsilegan hátt
- Highlight aðalniðurstöður

**Props**:
```typescript
interface LifeEnergyCardProps {
  lifeEnergyCost: LifeEnergyCost;
}
```

**Render skipulag**:
```tsx
<Card className="life-energy-card">
  <CardHeader icon={ClockIcon}>
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

    <HelpText>
      Til að vinna sér inn þessa upphæð þarft þú að vinna í {lifeEnergyCost.formattedString}.
    </HelpText>
  </CardBody>
</Card>
```

---

### 5. OpportunityCostCard

**Ábyrgð**:
- Sýna framtíðarvirði fyrir öll tímabil
- Explain tækifæriskostnað

**Props**:
```typescript
interface OpportunityCostCardProps {
  futureValues: FutureValueResult[];
  purchasePrice: number;
}
```

**Render skipulag**:
```tsx
<Card className="opportunity-cost-card">
  <CardHeader icon={TrendingUpIcon}>
    Tækifæriskostnaður
  </CardHeader>
  <CardBody>
    <HelpText>
      Ef þú fjárfestir {formatCurrency(purchasePrice)} í staðinn:
    </HelpText>

    {futureValues.map((fv) => (
      <FutureValueRow key={fv.years}>
        <Label>Eftir {fv.years} ár:</Label>
        <Value>{fv.formattedValue}</Value>
      </FutureValueRow>
    ))}

    <Insight>
      Þetta er munurinn á því að eyða peningunum núna á móti því að fjárfesta þá.
    </Insight>
  </CardBody>
</Card>
```

---

### 6. FIImpactCard (Conditional)

**Ábyrgð**:
- Sýna áhrif á FI tímalínu
- Bara sýnt ef FI gögn til staðar

**Props**:
```typescript
interface FIImpactCardProps {
  fiImpact: FIImpact;
}
```

**Render skipulag**:
```tsx
<Card className="fi-impact-card">
  <CardHeader icon={CalendarIcon}>
    Áhrif á fjárhagslegt frelsi
  </CardHeader>
  <CardBody>
    <BigNumber
      value={fiImpact.delayMonths}
      unit="mánuðir"
      label="Töf á FI dagsetningu"
    />

    <SecondaryMetric
      label="Auka vinnuklukkustundir"
      value={`${fiImpact.additionalWorkHours} klst`}
    />

    <PositiveFraming>
      Ef þú hættir við þessi kaup, nærðu fjárhagslegu frelsi {fiImpact.formattedDelay} fyrr.
    </PositiveFraming>
  </CardBody>
</Card>
```

---

### 7. ComparisonSection

**Ábyrgð**:
- Leyfa notanda að bæta við 2-3 valkostum
- Input fyrir hvern valkost

**Props**:
```typescript
interface ComparisonSectionProps {
  mainPurchase: PurchaseInput;
  comparisonOptions: PurchaseInput[];
  onOptionsChange: (options: PurchaseInput[]) => void;
}
```

**Render skipulag**:
```tsx
<Card>
  <CardHeader>Bera saman valkosti</CardHeader>
  <CardBody>
    <OptionInput
      label="Valkostur 1 (aðalkaup)"
      value={mainPurchase}
      disabled
    />

    {[0, 1].map((index) => (
      <OptionInput
        key={index}
        label={`Valkostur ${index + 2}`}
        value={comparisonOptions[index] || { price: 0, name: '' }}
        onChange={(value) => handleOptionChange(index, value)}
        onRemove={() => handleRemoveOption(index)}
      />
    ))}

    {comparisonOptions.length < 2 && (
      <Button onClick={handleAddOption}>
        Bæta við valkosti
      </Button>
    )}
  </CardBody>
</Card>
```

---

### 8. ComparisonResultsSection

**Ábyrgð**:
- Sýna samanburð á öllum valkostum hlið við hlið
- Highlight ódýrasta kostinn

**Props**:
```typescript
interface ComparisonResultsSectionProps {
  comparison: PurchaseComparison;
}
```

**Render skipulag**:
```tsx
<Card className="comparison-results">
  <CardHeader>Samanburður</CardHeader>
  <CardBody>
    <Table>
      <TableHeader>
        <th></th>
        {comparison.options.map((opt, idx) => (
          <th key={idx}>
            {opt.input.name || `Valkostur ${idx + 1}`}
            {idx === comparison.cheapestOptionIndex && (
              <Badge variant="success">Ódýrastur</Badge>
            )}
          </th>
        ))}
      </TableHeader>
      <TableBody>
        <TableRow label="Kaupverð">
          {comparison.options.map((opt, idx) => (
            <td key={idx}>{formatCurrency(opt.input.price)}</td>
          ))}
        </TableRow>

        <TableRow label="Lífsorgu klukkustundir">
          {comparison.options.map((opt, idx) => (
            <td key={idx}>{opt.lifeEnergyCost.totalHours.toFixed(1)} klst</td>
          ))}
        </TableRow>

        <TableRow label="Framtíðarvirði (20 ár)">
          {comparison.options.map((opt, idx) => {
            const fv20 = opt.futureValues.find(fv => fv.years === 20);
            return <td key={idx}>{fv20?.formattedValue}</td>;
          })}
        </TableRow>
      </TableBody>
    </Table>

    <ComparisonInsight
      cheapestOption={comparison.options[comparison.cheapestOptionIndex]}
      maxDifference={comparison.maxLifeEnergyDifference}
    />
  </CardBody>
</Card>
```

---

## Útreikningsvirkni

### 1. calculateLifeEnergyCost()

```typescript
/**
 * Reiknar lífsorgu kostnað fyrir kaup
 */
function calculateLifeEnergyCost(
  purchasePrice: number,
  actualHourlyWage: number
): LifeEnergyCost {
  const totalHours = purchasePrice / actualHourlyWage;
  const workDays = totalHours / 8; // 8 klst vinnudagur
  const workWeeks = totalHours / 40; // 40 klst vinnuvika

  const formattedString = formatLifeEnergy(totalHours);

  return {
    totalHours,
    workDays,
    workWeeks,
    formattedString,
  };
}

/**
 * Formats klukkustundir í læsilegan streng
 * t.d. "2 vikur og 3 dagar" eða "234 klukkustundir"
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

### 2. calculateFutureValue()

```typescript
/**
 * Reiknar framtíðarvirði fyrir gefin tímabil
 */
function calculateFutureValue(
  presentValue: number,
  annualReturnRate: number,
  years: number
): number {
  return presentValue * Math.pow(1 + annualReturnRate, years);
}

/**
 * Reiknar öll framtíðarvirði fyrir gefin tímabil
 */
function calculateFutureValues(
  purchasePrice: number,
  settings: PurchaseCalculationSettings
): FutureValueResult[] {
  return settings.futureValueYears.map((years) => {
    const value = calculateFutureValue(
      purchasePrice,
      settings.expectedReturnRate,
      years
    );

    return {
      years,
      value,
      formattedValue: formatCurrency(value),
    };
  });
}
```

---

### 3. calculateFIImpact()

```typescript
/**
 * Reiknar áhrif á FI tímalínu (ef gögn til staðar)
 */
function calculateFIImpact(
  purchasePrice: number,
  lifeEnergyCost: LifeEnergyCost,
  fiData: RequiredUserData['fiData']
): FIImpact | undefined {
  if (!fiData || !fiData.annualSavings || fiData.annualSavings <= 0) {
    return undefined;
  }

  const additionalWorkHours = lifeEnergyCost.totalHours;

  // Einföld nálgun: delayDays = (purchasePrice / annualSavings) * 365
  const delayYears = purchasePrice / fiData.annualSavings;
  const delayDays = Math.round(delayYears * 365);
  const delayMonths = Math.round(delayYears * 12);

  const formattedDelay = formatDelay(delayMonths);

  return {
    additionalWorkHours,
    delayDays,
    delayMonths,
    formattedDelay,
  };
}

/**
 * Format delay í læsilegan streng
 */
function formatDelay(months: number): string {
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

### 4. compareOptions()

```typescript
/**
 * Ber saman marga kaupmöguleika
 */
function compareOptions(
  options: PurchaseInput[],
  userData: RequiredUserData,
  settings: PurchaseCalculationSettings
): PurchaseComparison {
  if (!userData.actualHourlyWage) {
    throw new Error('actualHourlyWage is required for comparison');
  }

  // Reikna niðurstöður fyrir hvern valkost
  const results = options.map((option) =>
    calculatePurchaseResult(option, userData, settings)
  );

  // Finna ódýrasta valkostinn
  const cheapestOptionIndex = results.reduce((minIdx, result, idx, arr) =>
    result.lifeEnergyCost.totalHours < arr[minIdx].lifeEnergyCost.totalHours
      ? idx
      : minIdx,
    0
  );

  // Reikna hámarks mun
  const hourValues = results.map(r => r.lifeEnergyCost.totalHours);
  const maxLifeEnergyDifference = Math.max(...hourValues) - Math.min(...hourValues);

  return {
    options: results,
    cheapestOptionIndex,
    maxLifeEnergyDifference,
  };
}
```

---

### 5. calculatePurchaseResult() (Master Function)

```typescript
/**
 * Aðalútreikningsvirkni - reiknar allar niðurstöður fyrir eitt kaup
 */
function calculatePurchaseResult(
  input: PurchaseInput,
  userData: RequiredUserData,
  settings: PurchaseCalculationSettings
): PurchaseCalculationResult {
  if (!userData.actualHourlyWage) {
    throw new Error('actualHourlyWage is required');
  }

  if (input.price <= 0) {
    throw new Error('Purchase price must be greater than 0');
  }

  // 1. Lífsorgu kostnaður
  const lifeEnergyCost = calculateLifeEnergyCost(
    input.price,
    userData.actualHourlyWage
  );

  // 2. Framtíðarvirði
  const futureValues = calculateFutureValues(input.price, settings);

  // 3. FI áhrif (ef gögn til staðar)
  const fiImpact = calculateFIImpact(
    input.price,
    lifeEnergyCost,
    userData.fiData
  );

  return {
    input,
    lifeEnergyCost,
    futureValues,
    fiImpact,
  };
}
```

---

## Gagnaþrautseigja (Data Persistence)

### localStorage Strategy

```typescript
const STORAGE_KEY = 'oneTimePurchase_state';

/**
 * Vista state í localStorage
 */
function saveToLocalStorage(state: OneTimePurchaseState): void {
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
function loadFromLocalStorage(): OneTimePurchaseState | null {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;

    return JSON.parse(serialized) as OneTimePurchaseState;
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

Til að forðast að vista of oft í localStorage:

```typescript
import { useDebouncedCallback } from 'use-debounce';

// In component:
const debouncedSave = useDebouncedCallback(
  (state: OneTimePurchaseState) => {
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
 * Validation fyrir purchase input
 */
function validatePurchaseInput(input: PurchaseInput): ValidationResult {
  const errors: string[] = [];

  if (input.price <= 0) {
    errors.push('Kaupverð verður að vera stærra en 0');
  }

  if (input.price > 1_000_000_000) {
    errors.push('Kaupverð virðist óraunhæft hátt');
  }

  if (input.name && input.name.length > 100) {
    errors.push('Lýsing má vera að hámarki 100 stafir');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validation fyrir settings
 */
function validateSettings(settings: PurchaseCalculationSettings): ValidationResult {
  const errors: string[] = [];

  if (settings.expectedReturnRate < 0 || settings.expectedReturnRate > 0.15) {
    errors.push('Ávöxtunarkrafa verður að vera á milli 0% og 15%');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
```

### Error Display

```tsx
{validationErrors.length > 0 && (
  <Alert variant="error">
    <AlertTitle>Villur í inntaki</AlertTitle>
    <ul>
      {validationErrors.map((error, idx) => (
        <li key={idx}>{error}</li>
      ))}
    </ul>
  </Alert>
)}
```

### Missing Data Handling

```tsx
{!userData.actualHourlyWage && (
  <Alert variant="warning">
    <AlertTitle>Vantar upplýsingar</AlertTitle>
    <p>
      Þú þarft að fylla út{' '}
      <Link to="/actual-hourly-wage">Raunverulegt Tímakaup</Link>{' '}
      til að nota þetta verkfæri.
    </p>
  </Alert>
)}
```

---

## Prófunarstefna

### Unit Tests

**Prófar fyrir útreikningavirkni:**

```typescript
describe('calculateLifeEnergyCost', () => {
  test('reiknir rétt fyrir 2M kr við 4500 kr/klst', () => {
    const result = calculateLifeEnergyCost(2_000_000, 4500);
    expect(result.totalHours).toBeCloseTo(444.44, 1);
    expect(result.workWeeks).toBeCloseTo(11.11, 1);
  });

  test('formatar rétt í vikur og daga', () => {
    const result = calculateLifeEnergyCost(360_000, 4500); // 80 klst = 2 vikur
    expect(result.formattedString).toBe('2 vikur');
  });
});

describe('calculateFutureValue', () => {
  test('reiknir rétt 10 ára framtíðarvirði við 7%', () => {
    const result = calculateFutureValue(2_000_000, 0.07, 10);
    expect(result).toBeCloseTo(3_933_778, 0);
  });

  test('skilar upphaflegri upphæð við 0% ávöxtun', () => {
    const result = calculateFutureValue(2_000_000, 0, 10);
    expect(result).toBe(2_000_000);
  });
});

describe('calculateFIImpact', () => {
  test('reiknir rétta töf þegar annualSavings til staðar', () => {
    const lifeEnergyCost = { totalHours: 444, workDays: 55, workWeeks: 11, formattedString: '' };
    const fiData = { annualSavings: 1_200_000 };

    const result = calculateFIImpact(2_000_000, lifeEnergyCost, fiData);

    expect(result).toBeDefined();
    expect(result!.delayMonths).toBeCloseTo(20, 0);
  });

  test('skilar undefined ef engin FI gögn', () => {
    const lifeEnergyCost = { totalHours: 444, workDays: 55, workWeeks: 11, formattedString: '' };
    const result = calculateFIImpact(2_000_000, lifeEnergyCost, undefined);

    expect(result).toBeUndefined();
  });
});
```

**Prófar fyrir validation:**

```typescript
describe('validatePurchaseInput', () => {
  test('samþykkir gilt input', () => {
    const result = validatePurchaseInput({ price: 2_000_000, name: 'Bíll' });
    expect(result.isValid).toBe(true);
  });

  test('hafnar neikvæðu verði', () => {
    const result = validatePurchaseInput({ price: -100, name: '' });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Kaupverð verður að vera stærra en 0');
  });

  test('hafnar of langri lýsingu', () => {
    const longName = 'A'.repeat(101);
    const result = validatePurchaseInput({ price: 1000, name: longName });
    expect(result.isValid).toBe(false);
  });
});
```

### Integration Tests

```typescript
describe('OneTimePurchasePage Integration', () => {
  test('reiknar rétt þegar allt inntaksgögn gilt', () => {
    const userData = { actualHourlyWage: 4500, fiData: { annualSavings: 1_200_000 } };
    const input = { price: 2_000_000, name: 'Nýr bíll' };
    const settings = { expectedReturnRate: 0.07, futureValueYears: [10, 20, 30] };

    const result = calculatePurchaseResult(input, userData, settings);

    expect(result.lifeEnergyCost.totalHours).toBeCloseTo(444.44, 1);
    expect(result.futureValues).toHaveLength(3);
    expect(result.fiImpact).toBeDefined();
  });

  test('kastar villu ef actualHourlyWage vantar', () => {
    const userData = { actualHourlyWage: null };
    const input = { price: 2_000_000, name: '' };
    const settings = DEFAULT_SETTINGS;

    expect(() => {
      calculatePurchaseResult(input, userData as any, settings);
    }).toThrow();
  });
});
```

### Component Tests (React Testing Library)

```typescript
describe('PurchaseInputSection', () => {
  test('updates purchase on input change', () => {
    const handleChange = jest.fn();
    render(
      <PurchaseInputSection
        purchase={{ price: 0, name: '' }}
        settings={DEFAULT_SETTINGS}
        onPurchaseChange={handleChange}
        onSettingsChange={jest.fn()}
      />
    );

    const priceInput = screen.getByLabelText(/kaupverð/i);
    fireEvent.change(priceInput, { target: { value: '2000000' } });

    expect(handleChange).toHaveBeenCalledWith({ price: 2000000, name: '' });
  });
});

describe('LifeEnergyCard', () => {
  test('displays life energy cost correctly', () => {
    const lifeEnergyCost = {
      totalHours: 444.4,
      workDays: 55.5,
      workWeeks: 11.1,
      formattedString: '11 vikur og 1 dagur',
    };

    render(<LifeEnergyCard lifeEnergyCost={lifeEnergyCost} />);

    expect(screen.getByText(/444\.4/)).toBeInTheDocument();
    expect(screen.getByText(/11 vikur og 1 dagur/)).toBeInTheDocument();
  });
});
```

### Manual Testing Checklist

- [ ] Kaupverð input virkar og validation réttur
- [ ] Ávöxtunarkrafa slider uppfærir niðurstöður
- [ ] Lífsorgu kostnaður reiknaður rétt
- [ ] Framtíðarvirði fyrir öll 3 tímabil rétt
- [ ] FI áhrif sýnd aðeins ef gögn til staðar
- [ ] Samanburður virkar með 2-3 valkostum
- [ ] Ódýrasti kosturinn merktur rétt
- [ ] localStorage vistar og hleður rétt
- [ ] "Hreinsa" hnappur hreinsar gögn
- [ ] Virkar á mobile og desktop
- [ ] Lyklaborðs aðgengi virkar
- [ ] Skjálesari getur lesið allt úttak

---

## Hönnunarákvarðanir

### 1. Client-Side Only Calculations
**Ákvörðun**: Allir útreikningar gerðir á client-side, engin API köll.

**Valkostir**:
- A) Client-side only (valið)
- B) Backend API fyrir útreikninga

**Rökstuðningur**:
- Einfaldari arkitektúr
- Betri privacy (engin gögn send á server)
- Hraðari - engin network latency
- Útreikningar eru einfaldir og fljótir

**Trade-offs**:
- Formúlur eru sýnilegar í client code (en það er í lagi, ekki viðkvæmt)

---

### 2. Debounced localStorage Writes
**Ákvörðun**: Vista í localStorage með 500ms debounce.

**Valkostir**:
- A) Debounced writes (valið)
- B) Skrifa við hvern inntaksbreytingu
- C) Manual save button

**Rökstuðningur**:
- Debouncing kemur í veg fyrir of margar skrifingar
- Notandi þarf ekki að muna að ýta á "Vista"
- 500ms er nóg til að catch typing pauses

**Trade-offs**:
- Í versta falli gætu síðustu 500ms af breytingum tapast ef tab lokað skyndilega

---

### 3. Fixed Future Value Periods [10, 20, 30 years]
**Ákvörðun**: Föst tímabil fyrir framtíðarvirði, ekki custom.

**Valkostir**:
- A) Föst tímabil [10, 20, 30] (valið)
- B) Leyfa notanda að velja tímabil

**Rökstuðningur**:
- Einfaldari UI
- 10/20/30 ár eru algengir langtíma tímabilar
- Forðast ruglings með of margar valmöguleikar

**Trade-offs**:
- Minni sveigjanleiki, en flestir notendur vilja sjá þessi nákvæmlega tímabil

---

### 4. Simple FI Impact Calculation
**Ákvörðun**: Notum einfalda formúlu (purchasePrice / annualSavings) fyrir FI töf.

**Valkostir**:
- A) Einföld formúla (valið)
- B) Fullkomin FI simulation með compound interest

**Rökstuðningur**:
- Gefur "good enough" nálgun
- Einfalt að skilja og útskýra
- Fullt FI simulation krefst fleiri forsenda

**Trade-offs**:
- Nákvæmni þ að þetta er nálgun, en viðeigandi fyrir MVP

---

### 5. Comparison Mode Toggle
**Ákvörðun**: Samanburður er ekki sjálfgefið áberandi - notandi toggles það á.

**Valkostir**:
- A) Hidden by default með toggle (valið)
- B) Always visible

**Rökstuðningur**:
- Flestir notendur vilja bara meta eitt kaup
- UI minna cluttered fyrir aðalnotkun
- Power users geta kveikt á þessu

**Trade-offs**:
- Sumir notendur vita ekki um virkni

---

## Framtíðar útfærslumöguleikar

### Phase 2 Enhancements
1. **Recurring Costs**: Bæta við mánaðarlegum kostnaði (t.d. fjármögnun, tryggingar)
2. **Total Cost of Ownership**: Sýna heildar eignarhalds kostnað yfir X ár
3. **Charts**: Visual graf yfir tækifæriskostnað tíma

### Phase 3 Enhancements
1. **Purchase History**: Vista öll stórkaup í sögu
2. **Post-Purchase Review**: "Var þetta þess virði?" eftir 6-12 mánuði
3. **Happiness Factor**: Subjective slider fyrir vænt hamingju-ávöxtun

### Long-term Vision
1. **AI Insights**: "Flestir með svipuð markmið velja..."
2. **Integration with Budget**: Tengja við budget tracker til að sjá áhrif á monthly cash flow
3. **Scenario Builder**: "Hvað ef ég bíð 2 ár með kaupin?"

---

## Tæknilegir kröfur

### Dependencies
- React 18+
- TypeScript 4.9+
- Tailwind CSS
- React Router (fyrir navigation)
- use-debounce (fyrir debouncing)
- date-fns (fyrir date formatting ef FI dates notaðar)

### Browser Support
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

### Performance Targets
- Initial page load: < 1s
- Calculation time: < 50ms
- UI update after input: < 100ms (including debounce)

---

## Skráningar- og aðgengiskröfur

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility (ARIA labels)
- Color contrast ratios meet AA standards
- Focus indicators visible

### Logging (Development)
```typescript
// Log calculation errors
console.error('Calculation failed:', error);

// Log validation issues (development only)
if (process.env.NODE_ENV === 'development') {
  console.log('Validation errors:', errors);
}
```

### Analytics (Future)
Ef analytics bætt við síðar:
- Track calculation completions
- Track comparison mode usage
- Track common purchase price ranges
- Never track actual prices or personal data

---

## Samantekt

Þetta hönnunarskjal skilgreinir fullkomlega hvernig Einstakskaupaverkfæri virkar tæknilega:

- **Gagnalíkön** eru skýr með TypeScript interfaces
- **Íhlutir** eru vel skilgreindir með ábyrgðum og props
- **Útreikningar** eru nákvæmir með formúlum og dæmum
- **Virkni** dekkar allar kröfur úr requirements skjali
- **Prófanir** eru skipulagðar fyrir unit, integration og component tests

Þetta er tilbúið til að fara í tasks breakdown og implementation.
