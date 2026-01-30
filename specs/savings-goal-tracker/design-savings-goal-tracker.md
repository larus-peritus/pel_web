# Hönnun: Sparnaðarmarkmið Lífsorku Mælir (Savings Goal Life Energy Tracker)

## Yfirlit Hönnunar

**Eiginleiki**: Savings Goal Life Energy Tracker
**App**: peninganaedalifid.is
**Arkitektúr**: Client-side React/Next.js með localStorage
**Hönnunarmynstur**: React Hooks + Component Composition
**Hönnunardagsetning**: 2026-01-22

## Arkitektúryfirlit

### Kerfi Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface Layer                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Goal List    │  │ Goal Form    │  │ Dashboard    │  │
│  │ Component    │  │ Component    │  │ Summary      │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└───────────────┬─────────────────────────────────────────┘
                │
┌───────────────▼─────────────────────────────────────────┐
│                   Business Logic Layer                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ useSavings   │  │ Calculation  │  │ Validation   │  │
│  │ Goals Hook   │  │ Functions    │  │ Functions    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└───────────────┬─────────────────────────────────────────┘
                │
┌───────────────▼─────────────────────────────────────────┐
│                  Data Persistence Layer                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ localStorage │  │ Export/      │  │ Wage Data    │  │
│  │ Manager      │  │ Import       │  │ Integration  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Teknískt Stafla (Tech Stack)

| Lag | Tækni | Versión |
|-----|-------|---------|
| Framework | Next.js | 16.1.3 |
| Runtime | React | 19.2.3 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| UI Components | Lucide React (icons) | 0.562.0 |
| State Management | React Hooks | Built-in |
| Storage | localStorage API | Native |
| Testing | Vitest + Testing Library | 3.2.4 / 16.3.2 |

## Komponent Arkitektúr

### 1. Gagnalíkan (Data Model)

#### SavingsGoal Type

```typescript
/**
 * Represents a single savings goal
 */
export interface SavingsGoal {
  /** Unique identifier */
  id: string;

  /** Display name */
  name: string;

  /** Target amount in ISK */
  targetAmount: number;

  /** Current savings amount in ISK */
  currentAmount: number;

  /** Monthly contribution in ISK */
  monthlyContribution: number;

  /** Creation timestamp */
  createdAt: Date;

  /** Last updated timestamp */
  updatedAt: Date;

  /** Milestones achieved (10%, 25%, 50%, 75%, 100%) */
  achievedMilestones: number[];

  /** Whether goal is completed */
  isCompleted: boolean;

  /** Completion date if completed */
  completedAt?: Date;

  /** Custom sort order for manual sorting */
  sortOrder?: number;
}
```

#### SavingsGoalInput Type

```typescript
/**
 * Input type for creating/editing goals
 */
export interface SavingsGoalInput {
  name: string;
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
}
```

#### SavingsGoalCalculations Type

```typescript
/**
 * Calculated values for a savings goal
 */
export interface SavingsGoalCalculations {
  /** Progress percentage (0-100+) */
  progressPercentage: number;

  /** Hours of life energy worked */
  hoursWorked: number;

  /** Hours of life energy remaining */
  hoursRemaining: number;

  /** Formatted string for hours worked */
  formattedHoursWorked: string;

  /** Formatted string for hours remaining */
  formattedHoursRemaining: string;

  /** Months until goal achieved (if monthly contribution > 0) */
  monthsToGoal: number | null;

  /** Estimated completion date */
  estimatedCompletionDate: Date | null;

  /** Status category */
  status: 'started' | 'progressing' | 'almost-there' | 'achieved';

  /** Status color */
  statusColor: 'red' | 'yellow' | 'blue' | 'green';

  /** Next milestone percentage */
  nextMilestone: number | null;
}
```

#### SavingsSummary Type

```typescript
/**
 * Summary of all savings goals
 */
export interface SavingsSummary {
  /** Total number of active goals */
  totalGoals: number;

  /** Total target amount across all goals */
  totalTargetAmount: number;

  /** Total current savings across all goals */
  totalCurrentAmount: number;

  /** Weighted average progress percentage */
  overallProgress: number;

  /** Total hours of life energy worked */
  totalHoursWorked: number;

  /** Total hours of life energy remaining */
  totalHoursRemaining: number;

  /** Formatted total hours worked */
  formattedTotalHoursWorked: string;

  /** Formatted total hours remaining */
  formattedTotalHoursRemaining: string;
}
```

### 2. React Hooks

#### useSavingsGoals Hook

```typescript
/**
 * Main hook for managing savings goals
 * Handles CRUD operations, calculations, and localStorage persistence
 */
export function useSavingsGoals() {
  const [goals, setGoals] = useLocalStorage<SavingsGoal[]>('savings_goals', []);
  const [actualHourlyWage, setActualHourlyWage] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('progress-desc');

  // Load actual hourly wage from wage calculator
  useEffect(() => {
    const wageData = safeGetItem<CalculationResults>('calculator_results');
    if (wageData?.actualHourlyWage) {
      setActualHourlyWage(wageData.actualHourlyWage);
    }
  }, []);

  // Add goal (max 5)
  const addGoal = useCallback((input: SavingsGoalInput) => {
    // Validation and creation logic
  }, [goals]);

  // Update goal
  const updateGoal = useCallback((id: string, updates: Partial<SavingsGoalInput>) => {
    // Update logic
  }, [goals]);

  // Delete goal
  const deleteGoal = useCallback((id: string) => {
    // Delete logic
  }, [goals]);

  // Mark as completed
  const markAsCompleted = useCallback((id: string) => {
    // Completion logic
  }, [goals]);

  // Get calculations for a goal
  const getCalculations = useCallback((goal: SavingsGoal): SavingsGoalCalculations => {
    // Calculation logic
  }, [actualHourlyWage]);

  // Get summary
  const getSummary = useCallback((): SavingsSummary => {
    // Summary calculation logic
  }, [goals, actualHourlyWage]);

  // Sort goals
  const sortedGoals = useMemo(() => {
    // Sorting logic
  }, [goals, sortBy]);

  return {
    goals: sortedGoals,
    addGoal,
    updateGoal,
    deleteGoal,
    markAsCompleted,
    getCalculations,
    getSummary,
    actualHourlyWage,
    sortBy,
    setSortBy,
    canAddMore: goals.length < 5,
  };
}
```

#### useMilestoneNotification Hook

```typescript
/**
 * Hook for managing milestone achievement notifications
 * Shows toast notification when a milestone is reached for the first time
 */
export function useMilestoneNotification(
  goal: SavingsGoal,
  calculations: SavingsGoalCalculations
) {
  const { showToast } = useToast();
  const previousProgressRef = useRef<number>(0);

  useEffect(() => {
    const progress = calculations.progressPercentage;
    const milestones = [10, 25, 50, 75, 100];

    for (const milestone of milestones) {
      if (
        progress >= milestone &&
        previousProgressRef.current < milestone &&
        !goal.achievedMilestones.includes(milestone)
      ) {
        showMilestoneToast(goal.name, milestone);
        updateAchievedMilestones(goal.id, milestone);
      }
    }

    previousProgressRef.current = progress;
  }, [calculations.progressPercentage, goal, showToast]);
}
```

### 3. Útreikningafunkcijur (Calculation Functions)

#### savingsGoalCalculations.ts

```typescript
/**
 * Calculate all derived values for a savings goal
 */
export function calculateSavingsGoal(
  goal: SavingsGoal,
  actualHourlyWage: number
): SavingsGoalCalculations {
  // Progress percentage
  const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;

  // Life energy calculations
  const hoursWorked = dollarsToLifeEnergy(goal.currentAmount, actualHourlyWage);
  const remainingAmount = Math.max(0, goal.targetAmount - goal.currentAmount);
  const hoursRemaining = dollarsToLifeEnergy(remainingAmount, actualHourlyWage);

  // Format hours (reuse existing formatLifeEnergy with adaptation)
  const formattedHoursWorked = formatSavingsLifeEnergy(hoursWorked);
  const formattedHoursRemaining = formatSavingsLifeEnergy(hoursRemaining);

  // Time to goal calculation
  let monthsToGoal: number | null = null;
  let estimatedCompletionDate: Date | null = null;

  if (goal.monthlyContribution > 0 && remainingAmount > 0) {
    monthsToGoal = Math.ceil(remainingAmount / goal.monthlyContribution);
    estimatedCompletionDate = addMonths(new Date(), monthsToGoal);
  }

  // Status determination
  const status = getGoalStatus(progressPercentage);
  const statusColor = getStatusColor(status);

  // Next milestone
  const nextMilestone = getNextMilestone(
    progressPercentage,
    goal.achievedMilestones
  );

  return {
    progressPercentage,
    hoursWorked,
    hoursRemaining,
    formattedHoursWorked,
    formattedHoursRemaining,
    monthsToGoal,
    estimatedCompletionDate,
    status,
    statusColor,
    nextMilestone,
  };
}

/**
 * Format life energy for savings goals
 * Adapts to show hours, work days, or work weeks
 */
export function formatSavingsLifeEnergy(hours: number): string {
  if (hours < 0) return '0 klukkustundir';

  // < 8 hours: show hours
  if (hours < 8) {
    const rounded = Math.round(hours * 10) / 10;
    return `${rounded} ${rounded === 1 ? 'klukkustund' : 'klukkustundir'}`;
  }

  // 8-80 hours: show work days
  if (hours < 80) {
    const days = Math.round(hours / 8 * 10) / 10;
    return `${days} ${days === 1 ? 'vinnudagur' : 'vinnudagar'}`;
  }

  // >= 80 hours: show work weeks
  const weeks = Math.round(hours / 40 * 10) / 10;
  return `${weeks} ${weeks === 1 ? 'vinnuvika' : 'vinnuvikur'}`;
}

/**
 * Determine goal status based on progress percentage
 */
export function getGoalStatus(
  progressPercentage: number
): 'started' | 'progressing' | 'almost-there' | 'achieved' {
  if (progressPercentage >= 100) return 'achieved';
  if (progressPercentage >= 67) return 'almost-there';
  if (progressPercentage >= 34) return 'progressing';
  return 'started';
}

/**
 * Get status color
 */
export function getStatusColor(
  status: 'started' | 'progressing' | 'almost-there' | 'achieved'
): 'red' | 'yellow' | 'blue' | 'green' {
  const colorMap = {
    started: 'red',
    progressing: 'yellow',
    'almost-there': 'blue',
    achieved: 'green',
  } as const;

  return colorMap[status];
}

/**
 * Calculate summary across all goals
 */
export function calculateSavingsSummary(
  goals: SavingsGoal[],
  actualHourlyWage: number
): SavingsSummary {
  const activeGoals = goals.filter(g => !g.isCompleted);

  const totalTargetAmount = activeGoals.reduce(
    (sum, g) => sum + g.targetAmount,
    0
  );

  const totalCurrentAmount = activeGoals.reduce(
    (sum, g) => sum + g.currentAmount,
    0
  );

  const overallProgress = totalTargetAmount > 0
    ? (totalCurrentAmount / totalTargetAmount) * 100
    : 0;

  const totalHoursWorked = dollarsToLifeEnergy(
    totalCurrentAmount,
    actualHourlyWage
  );

  const totalHoursRemaining = dollarsToLifeEnergy(
    Math.max(0, totalTargetAmount - totalCurrentAmount),
    actualHourlyWage
  );

  return {
    totalGoals: activeGoals.length,
    totalTargetAmount,
    totalCurrentAmount,
    overallProgress,
    totalHoursWorked,
    totalHoursRemaining,
    formattedTotalHoursWorked: formatSavingsLifeEnergy(totalHoursWorked),
    formattedTotalHoursRemaining: formatSavingsLifeEnergy(totalHoursRemaining),
  };
}

/**
 * Get next milestone that hasn't been achieved
 */
export function getNextMilestone(
  progressPercentage: number,
  achievedMilestones: number[]
): number | null {
  const milestones = [10, 25, 50, 75, 100];

  for (const milestone of milestones) {
    if (
      progressPercentage < milestone &&
      !achievedMilestones.includes(milestone)
    ) {
      return milestone;
    }
  }

  return null;
}
```

### 4. Validation Functions

#### savingsGoalValidation.ts

```typescript
/**
 * Validation result type
 */
export interface ValidationResult {
  isValid: boolean;
  errors: {
    name?: string;
    targetAmount?: string;
    currentAmount?: string;
    monthlyContribution?: string;
  };
}

/**
 * Validate savings goal input
 */
export function validateSavingsGoalInput(
  input: SavingsGoalInput
): ValidationResult {
  const errors: ValidationResult['errors'] = {};

  // Name validation
  if (!input.name || input.name.trim().length === 0) {
    errors.name = 'Nafn er áskilið';
  } else if (input.name.length > 100) {
    errors.name = 'Nafn má ekki vera lengra en 100 stafir';
  }

  // Target amount validation
  if (input.targetAmount <= 0) {
    errors.targetAmount = 'Markkrónutala verður að vera stærri en 0';
  } else if (input.targetAmount > 1_000_000_000) {
    errors.targetAmount = 'Markkrónutala má ekki vera yfir 1.000.000.000 kr';
  }

  // Current amount validation
  if (input.currentAmount < 0) {
    errors.currentAmount = 'Núverandi sparnaður getur ekki verið neikvæður';
  } else if (input.currentAmount > input.targetAmount) {
    errors.currentAmount = 'Núverandi sparnaður getur ekki verið meiri en markkrónutala';
  }

  // Monthly contribution validation
  if (input.monthlyContribution < 0) {
    errors.monthlyContribution = 'Mánaðarlegt framlag getur ekki verið neikvætt';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate that user can add more goals
 */
export function canAddGoal(currentGoals: SavingsGoal[]): boolean {
  return currentGoals.filter(g => !g.isCompleted).length < 5;
}
```

### 5. Storage Functions

#### savingsGoalStorage.ts

```typescript
/**
 * Storage key constants
 */
export const STORAGE_KEYS = {
  GOALS: 'savings_goals',
  COMPLETED_GOALS: 'savings_goals_completed',
} as const;

/**
 * Export savings goals to JSON file
 */
export function exportSavingsGoals(goals: SavingsGoal[]): void {
  const data = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    goals,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const date = format(new Date(), 'yyyy-MM-dd');

  link.href = url;
  link.download = `sparnadarmarkmidin-${date}.json`;
  link.click();

  URL.revokeObjectURL(url);
}

/**
 * Import savings goals from JSON file
 */
export async function importSavingsGoals(
  file: File
): Promise<SavingsGoal[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        // Validate structure
        if (!data.goals || !Array.isArray(data.goals)) {
          throw new Error('Invalid file format');
        }

        // Validate and parse each goal
        const goals: SavingsGoal[] = data.goals.map((g: any) => ({
          ...g,
          createdAt: new Date(g.createdAt),
          updatedAt: new Date(g.updatedAt),
          completedAt: g.completedAt ? new Date(g.completedAt) : undefined,
        }));

        resolve(goals);
      } catch (error) {
        reject(new Error('Ekki tókst að flytja inn. Vinsamlegast veldu gilda sparnaðarmarkmið skrá.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}
```

### 6. UI Components

#### SavingsGoalDashboard.tsx (Page Component)

```typescript
/**
 * Main page component for Savings Goal Tracker
 */
export default function SavingsGoalDashboard() {
  const {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    markAsCompleted,
    getCalculations,
    getSummary,
    actualHourlyWage,
    sortBy,
    setSortBy,
    canAddMore,
  } = useSavingsGoals();

  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);

  const summary = getSummary();

  // Check if wage calculator data exists
  if (actualHourlyWage === null) {
    return <MissingWageDataPrompt />;
  }

  return (
    <PageLayout>
      <Section>
        <Container>
          {/* Header */}
          <SavingsGoalHeader
            canAddMore={canAddMore}
            onAddClick={() => setShowForm(true)}
          />

          {/* Summary Card */}
          <SavingsSummaryCard summary={summary} />

          {/* Sort Controls */}
          <SortControls sortBy={sortBy} onChange={setSortBy} />

          {/* Goals List */}
          <SavingsGoalList
            goals={goals}
            getCalculations={getCalculations}
            onEdit={setEditingGoal}
            onDelete={deleteGoal}
            onMarkComplete={markAsCompleted}
          />

          {/* Goal Form Modal */}
          {(showForm || editingGoal) && (
            <SavingsGoalFormModal
              goal={editingGoal}
              onSave={(input) => {
                if (editingGoal) {
                  updateGoal(editingGoal.id, input);
                } else {
                  addGoal(input);
                }
                setShowForm(false);
                setEditingGoal(null);
              }}
              onCancel={() => {
                setShowForm(false);
                setEditingGoal(null);
              }}
            />
          )}
        </Container>
      </Section>
    </PageLayout>
  );
}
```

#### SavingsSummaryCard.tsx

```typescript
/**
 * Summary card showing overview of all goals
 */
export function SavingsSummaryCard({ summary }: { summary: SavingsSummary }) {
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-2 border-blue-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Goals */}
        <StatItem
          label="Virk markmið"
          value={summary.totalGoals}
          icon={<Target />}
        />

        {/* Progress */}
        <StatItem
          label="Heildarframfarir"
          value={`${Math.round(summary.overallProgress)}%`}
          icon={<TrendingUp />}
        />

        {/* Life Energy */}
        <div className="space-y-2">
          <StatItem
            label="Unnið"
            value={summary.formattedTotalHoursWorked}
            icon={<CheckCircle />}
            variant="success"
          />
          <StatItem
            label="Eftir"
            value={summary.formattedTotalHoursRemaining}
            icon={<Clock />}
            variant="info"
          />
        </div>
      </div>
    </Card>
  );
}
```

#### SavingsGoalCard.tsx

```typescript
/**
 * Individual goal card with progress visualization
 */
export function SavingsGoalCard({
  goal,
  calculations,
  onEdit,
  onDelete,
  onMarkComplete,
}: SavingsGoalCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      {/* Header with name and actions */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold">{goal.name}</h3>
        <GoalActions
          onEdit={onEdit}
          onDelete={onDelete}
          onMarkComplete={onMarkComplete}
        />
      </div>

      {/* Progress Bar */}
      <ProgressBar
        percentage={calculations.progressPercentage}
        status={calculations.status}
        milestones={[10, 25, 50, 75, 100]}
        achievedMilestones={goal.achievedMilestones}
      />

      {/* Amount Display */}
      <AmountDisplay
        current={goal.currentAmount}
        target={goal.targetAmount}
        percentage={calculations.progressPercentage}
      />

      {/* Life Energy Display */}
      <LifeEnergyDisplay
        hoursWorked={calculations.formattedHoursWorked}
        hoursRemaining={calculations.formattedHoursRemaining}
        status={calculations.status}
      />

      {/* Time to Goal */}
      <TimeToGoalDisplay
        monthsToGoal={calculations.monthsToGoal}
        estimatedDate={calculations.estimatedCompletionDate}
        monthlyContribution={goal.monthlyContribution}
        isAchieved={calculations.status === 'achieved'}
      />
    </Card>
  );
}
```

#### SavingsGoalFormModal.tsx

```typescript
/**
 * Modal form for creating/editing goals
 */
export function SavingsGoalFormModal({
  goal,
  onSave,
  onCancel,
}: SavingsGoalFormModalProps) {
  const [formData, setFormData] = useState<SavingsGoalInput>(
    goal || {
      name: '',
      targetAmount: 0,
      currentAmount: 0,
      monthlyContribution: 0,
    }
  );

  const [errors, setErrors] = useState<ValidationResult['errors']>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateSavingsGoalInput(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSave(formData);
  };

  return (
    <Modal onClose={onCancel}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold">
          {goal ? 'Breyta markmiði' : 'Bæta við markmiði'}
        </h2>

        {/* Name Input */}
        <Input
          label="Nafn markmiðs"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          placeholder="t.d. Útborgun á húsnæði"
          maxLength={100}
          required
        />

        {/* Target Amount */}
        <CurrencyInput
          label="Markkrónutala"
          value={formData.targetAmount}
          onChange={(value) => setFormData({ ...formData, targetAmount: value })}
          error={errors.targetAmount}
          required
        />

        {/* Current Amount */}
        <CurrencyInput
          label="Núverandi sparnaður"
          value={formData.currentAmount}
          onChange={(value) => setFormData({ ...formData, currentAmount: value })}
          error={errors.currentAmount}
        />

        {/* Monthly Contribution */}
        <CurrencyInput
          label="Mánaðarlegt framlag"
          value={formData.monthlyContribution}
          onChange={(value) => setFormData({ ...formData, monthlyContribution: value })}
          error={errors.monthlyContribution}
          helpText="Hvað mikið er lagt til hliðar mánaðarlega"
        />

        {/* Actions */}
        <div className="flex gap-4">
          <Button type="submit" variant="primary">
            {goal ? 'Vista breytingar' : 'Búa til markmið'}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Hætta við
          </Button>
        </div>
      </form>
    </Modal>
  );
}
```

#### ProgressBar.tsx

```typescript
/**
 * Progress bar with milestone markers
 */
export function ProgressBar({
  percentage,
  status,
  milestones,
  achievedMilestones,
}: ProgressBarProps) {
  const colorClasses = {
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
  };

  const statusColor = getStatusColor(status);
  const clampedPercentage = Math.min(percentage, 100);

  return (
    <div className="relative w-full h-8 bg-gray-200 rounded-full overflow-hidden">
      {/* Progress fill */}
      <div
        className={`h-full ${colorClasses[statusColor]} transition-all duration-500`}
        style={{ width: `${clampedPercentage}%` }}
      />

      {/* Percentage text */}
      <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
        {Math.round(percentage)}%
      </div>

      {/* Milestone markers */}
      <div className="absolute inset-0">
        {milestones.map((milestone) => (
          <MilestoneMarker
            key={milestone}
            position={milestone}
            achieved={achievedMilestones.includes(milestone)}
          />
        ))}
      </div>
    </div>
  );
}
```

## Gagnaflæði (Data Flow)

### 1. Búa til markmið (Create Goal Flow)

```
User clicks "Bæta við markmiði"
  ↓
SavingsGoalFormModal opens
  ↓
User fills form
  ↓
Form validation (validateSavingsGoalInput)
  ↓
If valid: useSavingsGoals.addGoal()
  ↓
Generate unique ID (uuid)
  ↓
Create SavingsGoal object
  ↓
Update state
  ↓
useLocalStorage persists to localStorage
  ↓
UI updates with new goal
```

### 2. Uppfæra framfarir (Update Progress Flow)

```
User updates current amount or monthly contribution
  ↓
updateGoal() called with partial updates
  ↓
Merge updates with existing goal
  ↓
Update updatedAt timestamp
  ↓
Save to state
  ↓
useLocalStorage persists
  ↓
getCalculations() recalculates
  ↓
useMilestoneNotification checks for new milestones
  ↓
If milestone reached: show toast notification
  ↓
Update achievedMilestones array
  ↓
UI updates with new calculations
```

### 3. Sækja raunverulegt tímakaup (Fetch Actual Wage Flow)

```
Component mounts
  ↓
useSavingsGoals useEffect runs
  ↓
safeGetItem('calculator_results')
  ↓
Extract actualHourlyWage
  ↓
Set to state
  ↓
If null: show MissingWageDataPrompt
  ↓
If present: use for all life energy calculations
```

## Villa-meðhöndlun (Error Handling)

### Error Categories

| Tegund | Meðhöndlun | Notandaskilaboð |
|--------|------------|-----------------|
| Validation Error | Show field-specific errors | Red text under field |
| Storage Error | Fallback to memory, show warning | "Gögn geymd í minni" |
| Missing Wage Data | Show prompt component | "Vinsamlegast fylltu fyrst út..." |
| Import Error | Show error toast | "Ekki tókst að flytja inn..." |
| Max Goals Reached | Disable add button, show message | "Hámark náð. Þú getur haft..." |

### Error Handling Patterns

```typescript
// Validation errors
try {
  const validation = validateSavingsGoalInput(input);
  if (!validation.isValid) {
    setErrors(validation.errors);
    return;
  }
} catch (error) {
  console.error('Validation error:', error);
  showToast('Villa við villuleit', 'error');
}

// Storage errors (handled by useLocalStorage)
const [goals, setGoals, { error }] = useLocalStorage('savings_goals', []);

useEffect(() => {
  if (error) {
    showToast('Villa við að vista gögn. Gögn geymd í minni.', 'warning');
  }
}, [error]);

// Import errors
try {
  const importedGoals = await importSavingsGoals(file);
  // merge or replace logic
} catch (error) {
  showToast(error.message, 'error');
}
```

## Prófa Aðferð (Testing Strategy)

### Unit Tests

**savingsGoalCalculations.test.ts**
- `calculateSavingsGoal()` with various inputs
- `formatSavingsLifeEnergy()` for hours/days/weeks
- `getGoalStatus()` for all status ranges
- `calculateSavingsSummary()` with multiple goals
- `getNextMilestone()` logic
- Edge cases: zero wage, zero progress, completed goals

**savingsGoalValidation.test.ts**
- Valid inputs return `isValid: true`
- Invalid name (empty, too long)
- Invalid amounts (negative, over limits)
- Current > target validation
- `canAddGoal()` with 0-5 goals

**savingsGoalStorage.test.ts**
- Export creates valid JSON
- Import parses valid files
- Import rejects invalid files
- Date parsing/serialization

### Integration Tests

**useSavingsGoals.test.tsx**
- Add goal flow
- Update goal flow
- Delete goal flow
- Mark as completed flow
- Calculations update when wage changes
- LocalStorage persistence
- Sort functionality

### Component Tests

**SavingsGoalCard.test.tsx**
- Renders goal information correctly
- Progress bar shows correct percentage
- Milestone markers appear at correct positions
- Status colors match status
- Action buttons work

**SavingsGoalFormModal.test.tsx**
- Form validation works
- Submit creates/updates goal
- Cancel closes modal
- Error messages display

**SavingsSummaryCard.test.tsx**
- Summary calculations display correctly
- Updates when goals change

### E2E Test Scenarios

1. **Complete goal creation flow**
   - Navigate to tracker
   - Add first goal
   - Verify it appears
   - Verify calculations are correct

2. **Progress tracking flow**
   - Create goal
   - Update current amount
   - Verify milestone notification
   - Verify progress bar updates

3. **Multi-goal management**
   - Create 5 goals
   - Verify 6th is disabled
   - Sort by different criteria
   - Mark one as complete
   - Verify can add another

4. **Export/Import flow**
   - Create multiple goals
   - Export to JSON
   - Clear localStorage
   - Import JSON
   - Verify all goals restored

## Hönnunar Ákvarðanir (Design Decisions)

### 1. Client-Side Only Architecture

**Decision**: All calculations and storage happen client-side with no backend.

**Options Considered**:
- Client-side only (localStorage)
- Backend with database
- Hybrid (optional sync)

**Rationale**:
- Consistent with existing app architecture
- Privacy-first: no user data leaves device
- Zero latency for calculations
- No backend costs
- Simpler deployment

**Trade-offs**:
- No multi-device sync
- Data only persists in browser
- Export/import required for backup

---

### 2. Maximum 5 Active Goals

**Decision**: Limit to 5 active goals at a time.

**Options Considered**:
- No limit
- Limit to 3
- Limit to 5
- Limit to 10

**Rationale**:
- Prevents overwhelm (YMOYL philosophy: focused priorities)
- Keeps UI clean and scannable
- Forces prioritization
- Still flexible enough for typical use cases (emergency fund, house, car, vacation, other)

**Trade-offs**:
- Some users may want more
- Mitigation: completed goals can be archived

---

### 3. Life Energy Format Adaptation

**Decision**: Show hours, work days, or work weeks based on magnitude.

**Options Considered**:
- Always show hours
- Always show weeks
- Adaptive format (chosen)

**Rationale**:
- Better human comprehension ("3 work days" vs "24 hours")
- Matches how people think about time
- Easier to grasp large amounts ("10 work weeks" vs "400 hours")

**Trade-offs**:
- Less precise (rounded values)
- Slightly more complex formatting logic

---

### 4. Milestone Notifications

**Decision**: Toast notifications for first-time milestone achievements.

**Options Considered**:
- No notifications
- Every time milestone is crossed
- First time only (chosen)
- Modal popup

**Rationale**:
- Celebrates progress (motivational)
- Non-intrusive (toast vs modal)
- Doesn't spam (first time only)
- Creates positive reinforcement

**Trade-offs**:
- Requires tracking achieved milestones
- Slight complexity in notification logic

---

### 5. Sort Options

**Decision**: Provide 4 sort options: progress %, amount, time to goal, manual order.

**Options Considered**:
- No sorting (insertion order)
- Progress only
- Multiple options (chosen)

**Rationale**:
- Different users prioritize differently
- Progress: see what's closest to completion
- Amount: focus on largest goals
- Time to goal: prioritize what's achievable soonest
- Manual: full user control

**Trade-offs**:
- More UI complexity
- Need to persist sort preference

---

### 6. Integration with Wage Calculator

**Decision**: Read actual hourly wage from existing calculator's localStorage.

**Options Considered**:
- Separate wage input in tracker
- Read from wage calculator (chosen)
- Pass as prop from parent

**Rationale**:
- Single source of truth
- No duplicate data entry
- Automatic updates if wage changes
- Simpler user experience

**Trade-offs**:
- Tight coupling with wage calculator
- Must handle missing wage data gracefully

---

## Tæknilegar Takmarkanir (Technical Constraints)

### Performance Constraints

- Calculations must complete in < 50ms
- UI updates must be smooth (< 100ms transitions)
- Support up to 5 active + 50 completed goals without lag

### Browser Constraints

- localStorage limit: ~5-10MB (well within for JSON data)
- Must work in browsers without JS disabled (graceful degradation)
- Support last 2 versions of Chrome, Firefox, Safari, Edge

### Data Constraints

- Goal name: max 100 characters
- Target amount: max 1,000,000,000 ISK (1 billion)
- Store up to 100 goals (active + completed)

### Accessibility Constraints

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatible
- Color-blind friendly (not relying on color alone)
- Touch targets: minimum 44x44px

## Rekjanleiki til Krafna (Traceability to Requirements)

| Krafa | Hönnunarþáttur |
|-------|----------------|
| NS-1: Búa til markmið | SavingsGoalFormModal, addGoal(), validateSavingsGoalInput() |
| NS-2: Sjá framfarir í lífsorku | SavingsGoalCard, calculateSavingsGoal(), formatSavingsLifeEnergy() |
| NS-3: Sjá tíma þangað til markmið | TimeToGoalDisplay, monthsToGoal calculation |
| NS-4: Fylgjast með mörgum markmiðum | useSavingsGoals (max 5 check), SortControls |
| NS-5: Áfangar | useMilestoneNotification, MilestoneMarker, Toast notifications |
| NS-6: Breyta/eyða markmiðum | updateGoal(), deleteGoal(), markAsCompleted() |
| NS-7: Samtals yfirlit | SavingsSummaryCard, calculateSavingsSummary() |
| NS-8: Flytja út/inn | exportSavingsGoals(), importSavingsGoals() |
| NS-9: Farsíma stuðningur | Responsive Tailwind classes, touch-friendly components |

## Næstu Skref (Next Steps)

1. **Get Design Approval** - Review this design document
2. **Proceed to Tasks Phase** - Break down into implementation tasks
3. **Set up Testing Infrastructure** - Vitest config for savings goal tests
4. **Create Type Definitions** - TypeScript interfaces
5. **Implement Core Logic** - Calculations and validations first
6. **Build Components** - UI components with tests
7. **Integration** - Wire everything together
8. **E2E Testing** - Full user flows
9. **Documentation** - User guide and inline docs
