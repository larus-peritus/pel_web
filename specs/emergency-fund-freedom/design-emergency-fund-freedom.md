# Design: Emergency Fund Freedom Meter

## Document Information

- **Feature Name**: Emergency Fund Freedom Meter (Neyðarsjóður Frelsissmælir)
- **Version**: 1.0
- **Date**: 2026-01-22
- **Author**: Spec-Driven Development Orchestrator
- **Requirements Document**: requirements-emergency-fund-freedom.md

---

## 1. System Overview

### 1.1 Purpose

The Emergency Fund Freedom Meter is a client-side calculator that transforms emergency fund balances into meaningful, motivating metrics. It calculates "months of freedom" (financial runway), life energy hours of protection, risk assessment, and progress toward recommended savings targets.

### 1.2 Architecture Style

**Client-Side React Application**
- Next.js 16 with App Router
- TypeScript for type safety
- React Context for state management
- LocalStorage for data persistence
- No backend/server requirements (Phase 1-5)

### 1.3 Key Design Principles

1. **Privacy-First**: All data stored locally, no server transmission
2. **Integration**: Seamlessly share data with Actual Hourly Wage calculator
3. **Motivation**: Positive, encouraging language and visual feedback
4. **Localization**: Icelandic-first design with local context
5. **Accessibility**: WCAG 2.1 AA compliant from the start
6. **Performance**: Instant calculations (<100ms)

---

## 2. System Architecture

### 2.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Input Form   │  │ Results      │  │ Progress     │  │
│  │ Component    │  │ Display      │  │ Tracker      │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
└─────────┼──────────────────┼──────────────────┼─────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────┐
│               CalculatorContext (State)                  │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Emergency Fund State                            │   │
│  │  - balance: number                               │   │
│  │  - monthlyExpenses: number                       │   │
│  │  - calculationResults: EmergencyFundResults      │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│            Calculation Engine                            │
│  ┌───────────────┐  ┌───────────────┐  ┌────────────┐  │
│  │ Months of     │  │ Life Energy   │  │ Risk       │  │
│  │ Freedom       │  │ Calculator    │  │ Assessor   │  │
│  └───────────────┘  └───────────────┘  └────────────┘  │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│              Data Persistence Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ LocalStorage │  │ Export/      │  │ Integration  │  │
│  │ Manager      │  │ Import       │  │ with AWH*    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘

* AWH = Actual Hourly Wage calculator
```

### 2.2 Component Hierarchy

```
EmergencyFundCalculator (Page Component)
├── EmergencyFundInputs
│   ├── CurrencyInput (Balance)
│   ├── CurrencyInput (Monthly Expenses)
│   └── ExpenseExamplesSelector (Icelandic context)
├── EmergencyFundResults
│   ├── MonthsOfFreedomDisplay
│   │   ├── PrimaryMetric (months value with color)
│   │   └── AlternativeDisplay (weeks if < 1 month)
│   ├── LifeEnergyDisplay
│   │   ├── HoursProtected
│   │   └── WorkWeeksDisplay
│   └── RiskRatingCard
│       ├── RiskBadge (Underfunded → Excellent)
│       ├── RiskExplanation
│       └── ActionableRecommendation
├── TargetProgressTracker
│   ├── TargetMilestone (3 months)
│   │   ├── ProgressBar
│   │   └── AmountRemaining
│   ├── TargetMilestone (6 months)
│   └── TargetMilestone (12 months)
└── EducationalPanel (Collapsible)
    ├── EmergencyFundExplainer
    ├── CalculationMethodology
    └── FAQSection
```

### 2.3 Data Flow

**Input Flow:**
```
User Input → Validation → State Update → Calculation → Results Display
     ↓                                        ↓
LocalStorage                          AWH Integration
```

**Integration Flow:**
```
CalculatorContext.results.actualHourlyWage
          ↓
Life Energy Calculation
(balance / actualHourlyWage = hours)
          ↓
Display in Results
```

---

## 3. Component Design

### 3.1 EmergencyFundCalculator (Main Component)

**Responsibility**: Page-level container and coordinator

**Interface:**
```typescript
interface EmergencyFundCalculatorProps {
  // No props - gets data from CalculatorContext
}

// Internal state managed via context
interface EmergencyFundState {
  balance: number;
  monthlyExpenses: number;
  lastUpdated: Date;
}
```

**Key Features:**
- Wraps calculator in Section component (existing pattern)
- Provides educational header with collapsible info
- Coordinates between input and display components
- Handles localStorage persistence

**Dependencies:**
- CalculatorContext (existing)
- Section layout component
- UI components (Alert, Badge, etc.)

---

### 3.2 EmergencyFundInputs Component

**Responsibility**: Collect and validate user inputs

**Interface:**
```typescript
interface EmergencyFundInputsProps {
  balance: number;
  monthlyExpenses: number;
  onBalanceChange: (value: number) => void;
  onExpensesChange: (value: number) => void;
}
```

**Validation Rules:**
```typescript
const validateBalance = (value: number): ValidationResult => {
  if (isNaN(value)) return { valid: false, error: 'Vinsamlegast sláðu inn gilt númer' };
  if (value < 0) return { valid: false, error: 'Upphæð getur ekki verið neikvæð' };
  return { valid: true };
};

const validateExpenses = (value: number): ValidationResult => {
  if (isNaN(value)) return { valid: false, error: 'Vinsamlegast sláðu inn gilt númer' };
  if (value <= 0) return { valid: false, error: 'Mánaðarlegur kostnaður verður að vera hærri en 0' };
  return { valid: true };
};
```

**Sub-components:**
- **ExpenseExamplesSelector**: Preset expense ranges for Iceland
  - "Lágmark" (200,000 kr)
  - "Meðaltal" (350,000 kr)
  - "Rúmlegt" (500,000 kr)

**Dependencies:**
- CurrencyInput component (existing)
- Alert component for validation messages

---

### 3.3 EmergencyFundResults Component

**Responsibility**: Display calculated metrics with visual hierarchy

**Interface:**
```typescript
interface EmergencyFundResultsProps {
  results: EmergencyFundResults;
}

interface EmergencyFundResults {
  monthsOfFreedom: number;
  weeksOfFreedom: number | null; // Only if < 1 month
  lifeEnergyHours: number | null; // Null if AWH unavailable
  lifeEnergyWorkWeeks: number | null;
  lifeEnergyYears: number | null;
  riskRating: RiskRating;
  targets: TargetMilestone[];
}
```

**Visual Hierarchy:**
1. **Primary Metric**: Months of Freedom (largest, most prominent)
2. **Secondary Metrics**: Life Energy Hours, Risk Rating
3. **Progress Tracking**: Target milestones

**Color Coding System:**
```typescript
const getRatingColor = (months: number): ColorScheme => {
  if (months < 1) return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' };
  if (months < 3) return { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' };
  if (months < 6) return { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' };
  if (months < 12) return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' };
  return { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300' };
};
```

---

### 3.4 TargetProgressTracker Component

**Responsibility**: Show progress toward 3/6/12 month targets

**Interface:**
```typescript
interface TargetProgressTrackerProps {
  currentBalance: number;
  monthlyExpenses: number;
  targets: TargetMilestone[];
}

interface TargetMilestone {
  months: number;
  targetAmount: number;
  currentAmount: number;
  progress: number; // 0-100
  isAchieved: boolean;
  amountRemaining: number;
  purpose: string; // Explanation for this milestone
}
```

**Target Definitions:**
```typescript
const EMERGENCY_FUND_TARGETS = [
  {
    months: 3,
    purpose: 'Lágmarksöryggi fyrir smærri neyðartilvik og skammtíma atvinnutap',
  },
  {
    months: 6,
    purpose: 'Mælt með fyrir flesta - bætir við öryggi og sveigjanleika',
  },
  {
    months: 12,
    purpose: 'Sterkur grunnur fyrir langtíma fjármálaöryggi og frelsismarkmið',
  },
];
```

**Progress Calculation:**
```typescript
const calculateProgress = (balance: number, targetAmount: number): number => {
  return Math.min(100, (balance / targetAmount) * 100);
};
```

---

## 4. Data Models

### 4.1 Core Data Types

```typescript
/**
 * Emergency Fund Calculator Types
 */

export interface EmergencyFundData {
  balance: number; // Current emergency fund balance (ISK)
  monthlyExpenses: number; // Monthly essential expenses (ISK)
  lastUpdated: Date;
}

export interface EmergencyFundResults {
  // Primary metrics
  monthsOfFreedom: number; // Runway in months
  weeksOfFreedom: number | null; // Shown if < 1 month

  // Life energy metrics (null if AWH not available)
  lifeEnergyHours: number | null;
  lifeEnergyWorkWeeks: number | null; // Hours / 40
  lifeEnergyYears: number | null; // Hours / 8760

  // Risk assessment
  riskRating: RiskRating;
  riskLevel: 'underfunded' | 'minimal' | 'moderate' | 'strong' | 'excellent';

  // Target progress
  targets: TargetProgress[];
}

export interface RiskRating {
  level: 'underfunded' | 'minimal' | 'moderate' | 'strong' | 'excellent';
  label: string; // Icelandic label
  color: ColorScheme;
  explanation: string;
  recommendation: string | null; // Actionable tip (if needed)
}

export interface TargetProgress {
  months: number; // 3, 6, or 12
  targetAmount: number;
  currentAmount: number;
  progress: number; // 0-100
  isAchieved: boolean;
  amountRemaining: number;
  purpose: string;
}

export interface ColorScheme {
  bg: string; // Tailwind background class
  text: string; // Tailwind text class
  border: string; // Tailwind border class
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}
```

### 4.2 Integration Data Types

```typescript
/**
 * Integration with CalculatorContext
 */

// Add to existing CalculatorContext type
interface CalculatorContextType {
  // ... existing properties

  // Emergency Fund Calculator
  emergencyFundData: EmergencyFundData | null;
  emergencyFundResults: EmergencyFundResults | null;
  updateEmergencyFundData: (data: Partial<EmergencyFundData>) => void;
  clearEmergencyFundData: () => void;
}
```

### 4.3 LocalStorage Schema

```typescript
/**
 * Stored State (extends existing StoredState)
 */
interface StoredState {
  // ... existing properties

  emergencyFund?: {
    balance: number;
    monthlyExpenses: number;
    lastUpdated: string; // ISO date string
  };
}
```

---

## 5. Calculation Logic

### 5.1 Months of Freedom Calculator

**File**: `/src/lib/calculations/emergencyFund.ts`

```typescript
/**
 * Calculate months of freedom (financial runway)
 */
export const calculateMonthsOfFreedom = (
  balance: number,
  monthlyExpenses: number
): number => {
  if (monthlyExpenses <= 0) return 0;
  return balance / monthlyExpenses;
};

/**
 * Calculate weeks of freedom (for < 1 month scenarios)
 */
export const calculateWeeksOfFreedom = (months: number): number => {
  return months * 4.33; // Average weeks per month
};
```

### 5.2 Life Energy Calculator

```typescript
/**
 * Calculate life energy hours protected by emergency fund
 * Requires Actual Hourly Wage to be calculated
 */
export const calculateLifeEnergyHours = (
  balance: number,
  actualHourlyWage: number | null
): number | null => {
  if (!actualHourlyWage || actualHourlyWage <= 0) return null;
  return balance / actualHourlyWage;
};

/**
 * Convert hours to work-weeks (40 hours)
 */
export const hoursToWorkWeeks = (hours: number): number => {
  return hours / 40;
};

/**
 * Convert hours to years (24/7 hours)
 */
export const hoursToYears = (hours: number): number => {
  return hours / 8760; // 365 * 24
};
```

### 5.3 Risk Rating Calculator

```typescript
/**
 * Assess emergency fund adequacy and assign risk rating
 */
export const calculateRiskRating = (months: number): RiskRating => {
  if (months < 1) {
    return {
      level: 'underfunded',
      label: 'Vanfjármögnuð',
      color: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-300',
      },
      explanation: 'Þinn neyðarsjóður nær ekki eins mánaðar útgjöldum. Þetta er áhættusamt.',
      recommendation: 'Byrjaðu strax að leggja til hliðar. Jafnvel lítið framlag mánaðarlega gerir mikið.',
    };
  }

  if (months < 3) {
    return {
      level: 'minimal',
      label: 'Lágmarks',
      color: {
        bg: 'bg-orange-100',
        text: 'text-orange-800',
        border: 'border-orange-300',
      },
      explanation: 'Þú hefur grunn vernd, en 3 mánuði eru lágmarkið fyrir fjármálaöryggi.',
      recommendation: 'Haltu áfram að byggja upp - markmiðið er 3 mánuðir sem fyrsta áfangi.',
    };
  }

  if (months < 6) {
    return {
      level: 'moderate',
      label: 'Hóflegt',
      color: {
        bg: 'bg-amber-100',
        text: 'text-amber-800',
        border: 'border-amber-300',
      },
      explanation: 'Góður grunnur! Þú hefur náð fyrsta markmiðinu. 6 mánuðir gefa meiri sveigjanleika.',
      recommendation: null,
    };
  }

  if (months < 12) {
    return {
      level: 'strong',
      label: 'Sterkur',
      color: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-300',
      },
      explanation: 'Mjög gott! Þú hefur sterka vörn gegn óvæntum atvikum.',
      recommendation: null,
    };
  }

  return {
    level: 'excellent',
    label: 'Framúrskarandi',
    color: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-800',
      border: 'border-emerald-300',
    },
    explanation: 'Frábært! Þú hefur náð langtíma fjármálaöryggi. Íhugaðu fjárfestingarleiðir.',
    recommendation: null,
  };
};
```

### 5.4 Target Progress Calculator

```typescript
/**
 * Calculate progress toward emergency fund targets
 */
export const calculateTargetProgress = (
  balance: number,
  monthlyExpenses: number
): TargetProgress[] => {
  const targets = [3, 6, 12];

  return targets.map((months) => {
    const targetAmount = months * monthlyExpenses;
    const progress = Math.min(100, (balance / targetAmount) * 100);
    const isAchieved = balance >= targetAmount;
    const amountRemaining = Math.max(0, targetAmount - balance);

    return {
      months,
      targetAmount,
      currentAmount: balance,
      progress,
      isAchieved,
      amountRemaining,
      purpose: getTargetPurpose(months),
    };
  });
};

const getTargetPurpose = (months: number): string => {
  const purposes: Record<number, string> = {
    3: 'Lágmarksöryggi fyrir smærri neyðartilvik og skammtíma atvinnutap',
    6: 'Mælt með fyrir flesta - bætir við öryggi og sveigjanleika',
    12: 'Sterkur grunnur fyrir langtíma fjármálaöryggi og frelsismarkmið',
  };
  return purposes[months] || '';
};
```

### 5.5 Main Calculation Orchestrator

```typescript
/**
 * Calculate all emergency fund metrics
 * Integrates with Actual Hourly Wage from context
 */
export const calculateEmergencyFundResults = (
  data: EmergencyFundData,
  actualHourlyWage: number | null
): EmergencyFundResults => {
  const { balance, monthlyExpenses } = data;

  // Primary calculation
  const monthsOfFreedom = calculateMonthsOfFreedom(balance, monthlyExpenses);

  // Weeks display (if < 1 month)
  const weeksOfFreedom = monthsOfFreedom < 1
    ? calculateWeeksOfFreedom(monthsOfFreedom)
    : null;

  // Life energy calculations
  const lifeEnergyHours = calculateLifeEnergyHours(balance, actualHourlyWage);
  const lifeEnergyWorkWeeks = lifeEnergyHours
    ? hoursToWorkWeeks(lifeEnergyHours)
    : null;
  const lifeEnergyYears = lifeEnergyHours
    ? hoursToYears(lifeEnergyHours)
    : null;

  // Risk assessment
  const riskRating = calculateRiskRating(monthsOfFreedom);

  // Target progress
  const targets = calculateTargetProgress(balance, monthlyExpenses);

  return {
    monthsOfFreedom,
    weeksOfFreedom,
    lifeEnergyHours,
    lifeEnergyWorkWeeks,
    lifeEnergyYears,
    riskRating,
    riskLevel: riskRating.level,
    targets,
  };
};
```

---

## 6. Integration Strategy

### 6.1 Integration with Actual Hourly Wage Calculator

**Data Access Pattern:**

```typescript
// In EmergencyFundCalculator component
const { results, emergencyFundData, updateEmergencyFundData } = useCalculatorContext();

// Get actual hourly wage from main calculator
const actualHourlyWage = results?.actualHourlyWage || null;

// Calculate emergency fund results
const emergencyFundResults = useMemo(() => {
  if (!emergencyFundData) return null;
  return calculateEmergencyFundResults(emergencyFundData, actualHourlyWage);
}, [emergencyFundData, actualHourlyWage]);
```

**Missing Data Handling:**

```typescript
// If AWH not calculated yet
if (!actualHourlyWage) {
  return (
    <Alert variant="info">
      <p>Reiknaðu raunverulegt tímakaup þitt til að sjá lífsorkumælingu</p>
      <Button as="a" href="/#calculator">
        Opna Raunverulegt Tímakaup Reiknivél
      </Button>
    </Alert>
  );
}
```

### 6.2 CalculatorContext Extension

**State Addition:**

```typescript
// In CalculatorContext.tsx

const [emergencyFundData, setEmergencyFundData] = useState<EmergencyFundData | null>(null);

const updateEmergencyFundData = useCallback((data: Partial<EmergencyFundData>) => {
  setEmergencyFundData(prev => ({
    ...prev,
    ...data,
    lastUpdated: new Date(),
  } as EmergencyFundData));
}, []);

const emergencyFundResults = useMemo(() => {
  if (!emergencyFundData) return null;
  return calculateEmergencyFundResults(
    emergencyFundData,
    results?.actualHourlyWage || null
  );
}, [emergencyFundData, results?.actualHourlyWage]);
```

**LocalStorage Integration:**

```typescript
// Save to localStorage
useEffect(() => {
  if (emergencyFundData) {
    const currentState = safeGetItem<StoredState>(STORAGE_KEY) || {};
    safeSetItem(STORAGE_KEY, {
      ...currentState,
      emergencyFund: {
        balance: emergencyFundData.balance,
        monthlyExpenses: emergencyFundData.monthlyExpenses,
        lastUpdated: emergencyFundData.lastUpdated.toISOString(),
      },
    });
  }
}, [emergencyFundData]);

// Load from localStorage
useEffect(() => {
  const storedState = safeGetItem<StoredState>(STORAGE_KEY);
  if (storedState?.emergencyFund) {
    setEmergencyFundData({
      balance: storedState.emergencyFund.balance,
      monthlyExpenses: storedState.emergencyFund.monthlyExpenses,
      lastUpdated: new Date(storedState.emergencyFund.lastUpdated),
    });
  }
}, []);
```

### 6.3 Export/Import Integration

**Export Extension:**

```typescript
// In ExportImportButtons component
const exportData = () => {
  const data = {
    version: STORAGE_VERSION,
    exportDate: new Date().toISOString(),
    calculatorInputs: inputs,
    scenarios,
    subscriptions,
    emergencyFund: emergencyFundData, // Add emergency fund data
    // ... other data
  };

  downloadJSON(data, `peningana-eda-lifid-${Date.now()}.json`);
};
```

**Import Extension:**

```typescript
// In ExportImportButtons component
const importData = (file: File) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = JSON.parse(e.target?.result as string);

    // Validate and restore
    if (data.emergencyFund) {
      updateEmergencyFundData({
        balance: data.emergencyFund.balance,
        monthlyExpenses: data.emergencyFund.monthlyExpenses,
        lastUpdated: new Date(data.emergencyFund.lastUpdated),
      });
    }
  };
  reader.readAsText(file);
};
```

---

## 7. Error Handling Strategy

### 7.1 Input Validation Errors

**Pattern**: Show inline validation with clear Icelandic messages

```typescript
const ValidationMessage = ({ error }: { error: string | null }) => {
  if (!error) return null;

  return (
    <div className="mt-1 text-sm text-red-600" role="alert">
      {error}
    </div>
  );
};
```

**Error Types:**
- Non-numeric input: "Vinsamlegast sláðu inn gilt númer"
- Negative balance: "Upphæð getur ekki verið neikvæð"
- Zero/negative expenses: "Mánaðarlegur kostnaður verður að vera hærri en 0"

### 7.2 Calculation Errors

**Pattern**: Graceful degradation with user-friendly messages

```typescript
try {
  const results = calculateEmergencyFundResults(data, actualHourlyWage);
  return results;
} catch (error) {
  console.error('Emergency fund calculation error:', error);
  return {
    error: true,
    message: 'Villa kom upp við útreikninga. Vinsamlegast reyndu aftur.',
  };
}
```

### 7.3 LocalStorage Errors

**Pattern**: Fall back to session-only mode

```typescript
const saveToStorage = (data: EmergencyFundData) => {
  try {
    safeSetItem(STORAGE_KEY, data);
  } catch (error) {
    console.error('Storage error:', error);
    // Show warning but continue working
    showToast({
      type: 'warning',
      message: 'Gat ekki vistað gögn - breytingar tapast þegar vafra er lokað',
    });
  }
};
```

### 7.4 Integration Errors

**Pattern**: Degrade gracefully when AWH unavailable

```typescript
// Life energy display
{lifeEnergyHours !== null ? (
  <LifeEnergyDisplay hours={lifeEnergyHours} />
) : (
  <Alert variant="info">
    <AlertTitle>Lífsorkumæling ekki tiltæk</AlertTitle>
    <p>Reiknaðu raunverulegt tímakaup þitt til að sjá þessa mælingu.</p>
    <Button href="/#calculator" variant="secondary">
      Opna Reiknivél
    </Button>
  </Alert>
)}
```

---

## 8. User Interface Design

### 8.1 Layout Structure

**Page Organization:**

```
┌─────────────────────────────────────────────────────┐
│  Header: "Neyðarsjóður Frelsissmælir"               │
│  Subtitle: "Umbreyttu sparnaði í frelsissmánuði"    │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│  Educational Intro (Collapsible)                     │
│  "Hvað er neyðarsjóður og hvers vegna skiptir..."   │
└─────────────────────────────────────────────────────┘
┌──────────────────┐  ┌──────────────────────────────┐
│  Input Panel     │  │  Results Panel               │
│                  │  │                              │
│  Balance:        │  │  ┌─────────────────────────┐│
│  [     kr]       │  │  │ Months of Freedom       ││
│                  │  │  │      8.5                ││
│  Monthly Exp:    │  │  │ Frelsissmánuðir         ││
│  [     kr]       │  │  └─────────────────────────┘│
│                  │  │                              │
│  Examples:       │  │  Life Energy: 1,234 hours   │
│  ○ Lágmark       │  │  (30.9 work-weeks)          │
│  ○ Meðaltal      │  │                              │
│  ○ Rúmlegt       │  │  Risk: Sterkur 🟢          │
└──────────────────┘  └──────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│  Target Progress                                     │
│                                                      │
│  3 Months  [████████████████████████░] 100% ✓      │
│  Target: 1,050,000 kr                               │
│                                                      │
│  6 Months  [████████████████░░░░░░░░] 65%          │
│  Remaining: 750,000 kr                              │
│                                                      │
│  12 Months [████████░░░░░░░░░░░░░░░░] 35%          │
│  Remaining: 1,950,000 kr                            │
└─────────────────────────────────────────────────────┘
```

### 8.2 Responsive Breakpoints

**Mobile (<640px):**
- Stack input and results vertically
- Full-width components
- Simplified progress bars

**Tablet (640px-1024px):**
- Two-column layout (inputs | results)
- Compact progress cards

**Desktop (>1024px):**
- Full layout as shown above
- Enhanced spacing and typography

### 8.3 Visual Design Tokens

**Colors (Tailwind Classes):**

```typescript
const DESIGN_TOKENS = {
  riskColors: {
    underfunded: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-300',
    },
    minimal: {
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      border: 'border-orange-300',
    },
    moderate: {
      bg: 'bg-amber-100',
      text: 'text-amber-800',
      border: 'border-amber-300',
    },
    strong: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-300',
    },
    excellent: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-800',
      border: 'border-emerald-300',
    },
  },
  typography: {
    primaryMetric: 'text-6xl font-bold',
    secondaryMetric: 'text-3xl font-semibold',
    label: 'text-sm font-medium text-gray-700',
    explanation: 'text-sm text-gray-600',
  },
  spacing: {
    sectionGap: 'space-y-6',
    cardPadding: 'p-6',
    inputGap: 'space-y-4',
  },
};
```

### 8.4 Animation and Transitions

**Number Animations:**
```typescript
// Smooth number transitions using react-spring or CSS transitions
<motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.3 }}
>
  {monthsOfFreedom.toFixed(1)}
</motion.div>
```

**Progress Bar Animations:**
```typescript
<div className="h-2 bg-gray-200 rounded-full overflow-hidden">
  <div
    className="h-full bg-green-500 transition-all duration-500 ease-out"
    style={{ width: `${progress}%` }}
  />
</div>
```

**Milestone Achievement:**
```typescript
// Subtle celebration when target reached
{isAchieved && (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    ✓
  </motion.div>
)}
```

---

## 9. Testing Strategy

### 9.1 Unit Testing

**Test Files:**
- `emergencyFund.test.ts` - Calculation logic
- `EmergencyFundInputs.test.tsx` - Input validation
- `EmergencyFundResults.test.tsx` - Results display
- `TargetProgressTracker.test.tsx` - Progress calculations

**Test Coverage:**

```typescript
// emergencyFund.test.ts
describe('calculateMonthsOfFreedom', () => {
  it('calculates correct months for valid inputs', () => {
    expect(calculateMonthsOfFreedom(300000, 100000)).toBe(3);
  });

  it('handles decimal results correctly', () => {
    expect(calculateMonthsOfFreedom(350000, 100000)).toBe(3.5);
  });

  it('returns 0 for zero monthly expenses', () => {
    expect(calculateMonthsOfFreedom(300000, 0)).toBe(0);
  });
});

describe('calculateRiskRating', () => {
  it('assigns underfunded for < 1 month', () => {
    const rating = calculateRiskRating(0.5);
    expect(rating.level).toBe('underfunded');
    expect(rating.label).toBe('Vanfjármögnuð');
  });

  it('assigns excellent for >= 12 months', () => {
    const rating = calculateRiskRating(15);
    expect(rating.level).toBe('excellent');
  });
});

describe('calculateLifeEnergyHours', () => {
  it('calculates hours when AWH available', () => {
    expect(calculateLifeEnergyHours(300000, 2500)).toBe(120);
  });

  it('returns null when AWH unavailable', () => {
    expect(calculateLifeEnergyHours(300000, null)).toBeNull();
  });
});
```

### 9.2 Integration Testing

**Test Scenarios:**

```typescript
// Integration with CalculatorContext
describe('EmergencyFundCalculator Integration', () => {
  it('uses actual hourly wage from context', () => {
    const { result } = renderHook(() => useCalculatorContext(), {
      wrapper: CalculatorProvider,
    });

    // Set AWH
    act(() => {
      result.current.setInputs({
        income: { grossAnnualIncome: 6000000, ... },
        // ...
      });
    });

    // Set emergency fund
    act(() => {
      result.current.updateEmergencyFundData({
        balance: 300000,
        monthlyExpenses: 100000,
      });
    });

    expect(result.current.emergencyFundResults?.lifeEnergyHours).toBeDefined();
  });
});
```

### 9.3 Component Testing

**Testing Library Approach:**

```typescript
// EmergencyFundInputs.test.tsx
describe('EmergencyFundInputs', () => {
  it('shows validation error for negative balance', async () => {
    const { getByLabelText, getByText } = render(<EmergencyFundInputs />);

    const balanceInput = getByLabelText(/neyðarsjóður/i);
    await userEvent.type(balanceInput, '-1000');

    expect(getByText(/getur ekki verið neikvæð/i)).toBeInTheDocument();
  });

  it('updates on valid input', async () => {
    const onBalanceChange = vi.fn();
    const { getByLabelText } = render(
      <EmergencyFundInputs onBalanceChange={onBalanceChange} />
    );

    const balanceInput = getByLabelText(/neyðarsjóður/i);
    await userEvent.type(balanceInput, '300000');

    expect(onBalanceChange).toHaveBeenCalledWith(300000);
  });
});
```

### 9.4 Accessibility Testing

**Test Cases:**
- Keyboard navigation through all inputs and buttons
- Screen reader announcements for dynamic content
- Color contrast ratios meet WCAG AA
- Focus indicators visible
- ARIA labels present and correct

```typescript
describe('Accessibility', () => {
  it('has proper ARIA labels', () => {
    const { getByLabelText } = render(<EmergencyFundCalculator />);

    expect(getByLabelText('Núverandi neyðarsjóður')).toBeInTheDocument();
    expect(getByLabelText('Mánaðarlegur kostnaður')).toBeInTheDocument();
  });

  it('announces results to screen readers', () => {
    const { getByRole } = render(<EmergencyFundResults results={mockResults} />);

    const statusRegion = getByRole('status');
    expect(statusRegion).toHaveAttribute('aria-live', 'polite');
  });
});
```

### 9.5 End-to-End Testing (Manual)

**Test Scenarios:**
1. Complete calculation flow (input → results → targets)
2. Integration with AWH calculator
3. LocalStorage persistence across sessions
4. Export/import functionality
5. Responsive layout on mobile/tablet/desktop
6. Color-blind mode compatibility

---

## 10. Performance Considerations

### 10.1 Calculation Performance

**Optimization Strategy:**
- Memoize expensive calculations with `useMemo`
- Debounce input changes (300ms)
- Avoid unnecessary re-renders

```typescript
// Debounced input handling
const debouncedUpdateBalance = useMemo(
  () => debounce((value: number) => {
    updateEmergencyFundData({ balance: value });
  }, 300),
  [updateEmergencyFundData]
);
```

**Performance Budget:**
- Calculation time: <100ms
- Input response: <50ms (debounced)
- Page load: <2s on 3G

### 10.2 Rendering Performance

**React Performance:**
```typescript
// Prevent unnecessary re-renders
const EmergencyFundResults = React.memo(({ results }: Props) => {
  // ...
});

// Use proper dependency arrays
const emergencyFundResults = useMemo(() => {
  return calculateEmergencyFundResults(data, actualHourlyWage);
}, [data, actualHourlyWage]); // Only recalculate when these change
```

### 10.3 Bundle Size

**Code Splitting:**
- Lazy load educational content
- Dynamic imports for less-used features

```typescript
const EducationalPanel = lazy(() => import('./EducationalPanel'));

// In component
<Suspense fallback={<Skeleton />}>
  <EducationalPanel />
</Suspense>
```

---

## 11. Accessibility Implementation

### 11.1 WCAG 2.1 AA Compliance

**Requirements Checklist:**
- [x] Keyboard navigation (Tab, Enter, Space)
- [x] Screen reader support (ARIA labels, live regions)
- [x] Color contrast ≥ 4.5:1 for normal text, ≥ 3:1 for large text
- [x] Focus indicators visible and clear
- [x] Form labels associated with inputs
- [x] Error messages programmatically associated
- [x] Color not sole indicator (use icons + patterns)
- [x] Text resizable to 200% without loss of functionality

### 11.2 ARIA Implementation

```typescript
// Input fields
<label htmlFor="emergency-fund-balance">
  Núverandi neyðarsjóður
</label>
<input
  id="emergency-fund-balance"
  type="number"
  aria-describedby="balance-help"
  aria-invalid={hasError}
  aria-errormessage={hasError ? "balance-error" : undefined}
/>
<p id="balance-help" className="text-sm text-gray-600">
  Heildarupphæð í neyðarsjóði þínum
</p>
{hasError && (
  <p id="balance-error" role="alert" className="text-red-600">
    {errorMessage}
  </p>
)}

// Dynamic results
<div role="status" aria-live="polite" aria-atomic="true">
  <p>
    Þú getur lifað af í {monthsOfFreedom.toFixed(1)} mánuði með núverandi neyðarsjóði
  </p>
</div>

// Progress indicators
<div
  role="progressbar"
  aria-valuenow={progress}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label={`Framvinda að ${months} mánaða markmiði`}
>
  <div style={{ width: `${progress}%` }} />
</div>
```

### 11.3 Keyboard Navigation

**Tab Order:**
1. Balance input
2. Monthly expenses input
3. Expense example buttons
4. Educational panel toggle
5. Link to AWH calculator (if shown)

**Keyboard Shortcuts:**
- Tab: Move focus forward
- Shift+Tab: Move focus backward
- Enter/Space: Activate buttons
- Escape: Close modals/tooltips

### 11.4 Screen Reader Support

**Announcements:**
- Input changes debounced to avoid excessive announcements
- Results announced when calculations complete
- Target achievements announced when reached
- Error messages announced immediately

```typescript
// Use aria-live regions
<div aria-live="polite" aria-atomic="true">
  {results && (
    <span className="sr-only">
      Útreikningar uppfærðir. {monthsOfFreedom} frelsissmánuðir.
      Áhættumat: {riskRating.label}.
    </span>
  )}
</div>
```

---

## 12. Localization (Icelandic)

### 12.1 Text Content

**All user-facing text in Icelandic:**

```typescript
const TRANSLATIONS = {
  // Page headers
  title: 'Neyðarsjóður Frelsissmælir',
  subtitle: 'Umbreyttu sparnaði í frelsissmánuði og lífsorkuskjól',

  // Input labels
  balanceLabel: 'Núverandi neyðarsjóður',
  balanceHelp: 'Heildarupphæð í neyðarsjóði þínum',
  expensesLabel: 'Mánaðarlegur nauðsynlegur kostnaður',
  expensesHelp: 'Lágmarkskostnaður fyrir húsnæði, mat, veitur, tryggingar',

  // Results
  monthsOfFreedom: 'Frelsissmánuðir',
  weeksOfFreedom: 'Frelsisvikur',
  lifeEnergyHours: 'Lífsorkuskjól',
  riskRating: 'Áhættumat',

  // Risk levels
  riskLevels: {
    underfunded: 'Vanfjármögnuð',
    minimal: 'Lágmarks',
    moderate: 'Hóflegt',
    strong: 'Sterkur',
    excellent: 'Framúrskarandi',
  },

  // Targets
  targetProgress: 'Framvinda að markmiðum',
  target3Months: '3 mánaða markmið',
  target6Months: '6 mánaða markmið',
  target12Months: '12 mánaða markmið',

  // Expense examples
  expenseExamples: 'Dæmi um mánaðarlegan kostnað á Íslandi',
  exampleMinimal: 'Lágmark (grunn þarfir)',
  exampleAverage: 'Meðaltal (þægilegt)',
  exampleGenerous: 'Rúmlegt',

  // Messages
  noAWH: 'Reiknaðu raunverulegt tímakaup þitt til að sjá lífsorkumælingu',
  calculationError: 'Villa kom upp við útreikninga. Vinsamlegast reyndu aftur.',
  storageWarning: 'Gat ekki vistað gögn - breytingar tapast þegar vafra er lokað',
};
```

### 12.2 Number Formatting

**Icelandic Format:**
- Thousands separator: space or thin space
- Decimal separator: comma (,)
- Currency: "kr" suffix

```typescript
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('is-IS', {
    style: 'currency',
    currency: 'ISK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Example output: "300.000 kr"
```

```typescript
const formatNumber = (num: number, decimals: number = 1): string => {
  return new Intl.NumberFormat('is-IS', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

// Example output: "8,5" (months)
```

### 12.3 Icelandic Context Examples

**Expense Presets:**

```typescript
const ICELANDIC_EXPENSE_EXAMPLES = [
  {
    id: 'minimal',
    label: 'Lágmark (grunn þarfir)',
    amount: 200000,
    description: 'Leigu í smærri íbúð, grunnmatur, lágmarks veitur',
  },
  {
    id: 'average',
    label: 'Meðaltal (þægilegt)',
    amount: 350000,
    description: 'Meðalleiga, heilnæmt mataræði, venjulegur kostnaður',
  },
  {
    id: 'generous',
    label: 'Rúmlegt',
    amount: 500000,
    description: 'Rýmri húsnæði, góður matur, fleiri þægindi',
  },
];
```

---

## 13. Technical Decisions

### 13.1 Technology Stack

**Decision**: Use existing Next.js/React/TypeScript stack

**Rationale**:
- Consistent with existing application
- Leverage existing components and patterns
- No new dependencies required (except optional animation library)
- Developer familiarity

**Alternatives Considered**:
- Vue.js: Rejected (inconsistent with existing app)
- Standalone library: Rejected (unnecessary complexity)

### 13.2 State Management

**Decision**: Extend existing CalculatorContext

**Rationale**:
- Centralized state management already in place
- Easy integration with AWH calculator
- LocalStorage persistence already implemented
- Export/import infrastructure exists

**Alternatives Considered**:
- Separate context: Rejected (creates integration complexity)
- Redux: Rejected (overkill for this feature size)
- Local component state: Rejected (loses cross-calculator integration)

### 13.3 Calculation Timing

**Decision**: Real-time calculation with 300ms debounce

**Rationale**:
- Instant feedback improves UX
- Debounce prevents excessive calculations during typing
- Meets <100ms calculation performance requirement
- Reduces localStorage write frequency

**Alternatives Considered**:
- On-blur calculation: Rejected (less responsive)
- No debounce: Rejected (too many calculations)
- Manual "Calculate" button: Rejected (extra friction)

### 13.4 Animation Library

**Decision**: Optional - use CSS transitions or framer-motion if needed

**Rationale**:
- CSS transitions sufficient for most animations
- framer-motion already used in other parts of app (if needed)
- Keep bundle size small
- Progressive enhancement approach

**Alternatives Considered**:
- react-spring: Rejected (another dependency)
- GSAP: Rejected (heavyweight)
- No animations: Considered but animations improve UX

### 13.5 Data Persistence

**Decision**: LocalStorage with export/import capability

**Rationale**:
- Consistent with existing app architecture
- Privacy-first approach (no server storage)
- Export/import provides backup/portability
- Browser compatibility excellent

**Alternatives Considered**:
- IndexedDB: Rejected (overkill for simple data)
- Server storage: Rejected (Phase 1-5 constraint)
- SessionStorage only: Rejected (data loss too easy)

### 13.6 Icelandic Expense Examples

**Decision**: Hardcoded presets with annual review plan

**Rationale**:
- Simple implementation
- Provides helpful starting points
- Easy to update annually
- No API/database needed

**Alternatives Considered**:
- API for real-time cost data: Rejected (no backend in Phase 1-5)
- User-submitted averages: Rejected (privacy concerns, moderation)
- No examples: Rejected (reduces usability)

---

## 14. Design Traceability to Requirements

| Requirement | Design Component | Implementation |
|-------------|------------------|----------------|
| **Req 1**: Emergency Fund Input Collection | EmergencyFundInputs component | CurrencyInput with validation, ExpenseExamplesSelector |
| **Req 2**: Months of Freedom Calculation | calculateMonthsOfFreedom() | Core calculation in emergencyFund.ts |
| **Req 3**: Life Energy Hours Calculation | calculateLifeEnergyHours() | Integration with AWH via CalculatorContext |
| **Req 4**: Risk Rating Assessment | calculateRiskRating() | 5-tier system with color coding |
| **Req 5**: Target Recommendations | TargetProgressTracker component | 3/6/12 month milestones with progress bars |
| **Req 6**: Icelandic Context | ICELANDIC_EXPENSE_EXAMPLES | Preset selector with local examples |
| **Req 7**: Data Persistence | CalculatorContext + localStorage | Extends existing persistence infrastructure |
| **Req 8**: Visual Design | EmergencyFundResults + UI components | Responsive layout, color coding, animations |
| **Req 9**: Educational Content | EducationalPanel component | Collapsible explanations and FAQ |
| **Req 10**: Calculator Integration | CalculatorContext integration | Shared actualHourlyWage from results |

### Non-Functional Requirements Traceability

| NFR Category | Design Solution |
|--------------|-----------------|
| **Performance** | useMemo, debounce, React.memo |
| **Security** | LocalStorage only, no server transmission |
| **Usability** | Icelandic UI, clear error messages, tooltips |
| **Reliability** | Try-catch blocks, fallback UI, validation |
| **Accessibility** | ARIA labels, keyboard nav, screen reader support |
| **Localization** | Icelandic text, ISK formatting, local examples |

---

## 15. Implementation Risks and Mitigations

### Risk 1: AWH Calculator Not Completed

**Risk**: Life energy calculation depends on Actual Hourly Wage calculator being finished first.

**Likelihood**: Medium
**Impact**: Medium

**Mitigation**:
- Design for graceful degradation (life energy section shows info message)
- Can implement and test without AWH (mock data)
- Alternative: Implement emergency fund calculator first, add AWH integration later

### Risk 2: Icelandic Expense Examples Become Outdated

**Risk**: Hardcoded expense examples may not reflect current costs.

**Likelihood**: High (over time)
**Impact**: Low

**Mitigation**:
- Document examples with date and source
- Plan annual review (e.g., January each year)
- Include disclaimer: "Dæmi frá janúar 2026"
- Future: Could add CPI adjustment factor

### Risk 3: LocalStorage Quota Exceeded

**Risk**: Browser may run out of localStorage space with multiple calculators.

**Likelihood**: Low
**Impact**: Medium

**Mitigation**:
- Monitor storage usage
- Implement cleanup of old data
- Provide clear error message with export suggestion
- Emergency fund data is small (~100 bytes)

### Risk 4: Number Formatting Edge Cases

**Risk**: Very large or very small numbers may not format correctly.

**Likelihood**: Low
**Impact**: Low

**Mitigation**:
- Use Intl.NumberFormat for consistent formatting
- Test edge cases (0, 0.01, 999999999)
- Cap display at reasonable ranges
- Round appropriately (months to 1 decimal, currency to whole ISK)

### Risk 5: Accessibility Testing Coverage

**Risk**: May miss accessibility issues without specialized testing.

**Likelihood**: Medium
**Impact**: High

**Mitigation**:
- Use automated tools (axe, Lighthouse)
- Manual keyboard navigation testing
- Screen reader testing (VoiceOver, NVDA)
- Consider accessibility consultant review
- Follow existing app patterns (already accessible)

---

## 16. Future Enhancements (Out of Scope for MVP)

### Phase 2 Considerations

1. **Historical Tracking**
   - Track balance over time
   - Graph showing progress toward targets
   - Milestone celebration system

2. **Scenario Planning**
   - "What if" scenarios (job loss, expense increase)
   - Monte Carlo simulation for emergency risk
   - Income volatility consideration

3. **Smart Recommendations**
   - Personalized savings rate suggestions
   - Emergency fund contribution calculator
   - Integration with actual income/expenses

4. **Social Features** (Privacy-respecting)
   - Anonymous benchmarking ("You're in top 25% of savers")
   - Share achievements (opt-in)
   - Community goals

5. **Advanced Integrations**
   - Link to other calculators (housing, childcare total monthly)
   - Auto-populate expenses from those calculators
   - Financial independence date impact

6. **Inflation Adjustment**
   - CPI-adjusted expense examples
   - Real vs. nominal purchasing power
   - Historical inflation consideration

---

## 17. Open Questions and Decisions Needed

### Questions for Stakeholders

1. **Expense Examples**: Should we provide more granular categories (with/without car, single/family)?
   - **Recommendation**: Start with 3 simple examples, gather user feedback

2. **Life Energy Years Display**: Should we show fractional years (e.g., "2.3 ár") or months when < 5 years?
   - **Recommendation**: Show in largest meaningful unit (months if < 1 year, years if >= 1 year)

3. **Target Customization**: Should users be able to set custom targets beyond 3/6/12?
   - **Recommendation**: MVP uses fixed targets, add customization in Phase 2

4. **Integration Depth**: Should emergency fund expenses auto-sync with other calculator expenses?
   - **Recommendation**: No auto-sync in MVP (manual entry), consider in Phase 2

5. **Educational Content Depth**: How detailed should explanations be?
   - **Recommendation**: Brief in-app explanations, link to detailed guide/blog post

### Technical Decisions Needed

1. **Animation Library**: Use CSS-only or add framer-motion?
   - **Recommendation**: Start with CSS, add framer-motion if animations need more sophistication

2. **Validation Library**: Use existing validation or add zod/yup?
   - **Recommendation**: Simple inline validation (no library), consistent with existing app

3. **Testing Depth**: Unit tests only or also E2E with Playwright?
   - **Recommendation**: Unit + integration tests (Vitest), manual E2E for MVP

---

## 18. Design Review Checklist

### Completeness
- [x] All functional requirements addressed
- [x] All non-functional requirements addressed
- [x] Component hierarchy defined
- [x] Data models specified
- [x] Calculation logic detailed
- [x] Error handling strategy defined
- [x] Testing strategy outlined
- [x] Accessibility implementation planned

### Feasibility
- [x] Uses existing technology stack
- [x] No new dependencies (except optional animation)
- [x] Integrates with existing CalculatorContext
- [x] Follows established patterns
- [x] Performance requirements achievable

### Quality
- [x] Privacy-first design maintained
- [x] Icelandic localization complete
- [x] Accessibility compliant (WCAG 2.1 AA)
- [x] Error handling comprehensive
- [x] User experience optimized

### Traceability
- [x] All requirements mapped to design components
- [x] Design decisions documented with rationale
- [x] Risks identified and mitigated
- [x] Future enhancements considered but scoped out

### Consistency
- [x] Matches existing app architecture
- [x] Uses existing component library
- [x] Follows naming conventions
- [x] Consistent with "Your Money or Your Life" philosophy

---

**Design Phase Complete: Ready for Tasks Breakdown**
