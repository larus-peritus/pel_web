# Design: Interest Savings Snowball Calculator

## Overview

**Feature**: Interest Savings Snowball Calculator (Vaxtasparnaður Snjóboltareiknivél)
**Requirements**: requirements-interest-savings-snowball.md
**Status**: Design Phase

## Architecture

### Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    SnowballCalculatorPage                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   LoanInputCard │  │ InvestmentCard  │  │ ExtraPaymentCard│  │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘  │
│           │                    │                    │           │
│           └────────────────────┼────────────────────┘           │
│                                ▼                                │
│                    ┌───────────────────────┐                    │
│                    │ calculateSnowball()   │                    │
│                    │ (calculation engine)  │                    │
│                    └───────────┬───────────┘                    │
│                                │                                │
│           ┌────────────────────┼────────────────────┐           │
│           ▼                    ▼                    ▼           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │ ScenarioSummary │  │ SnowballChart   │  │ MonthlyBreakdown│  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    RecommendationCard                       ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### File Structure

```
src/
├── components/
│   └── snowball/
│       ├── index.ts                    # Barrel export
│       ├── SnowballCalculatorPage.tsx  # Main page component
│       ├── ScenarioSummary.tsx         # Three-scenario comparison cards
│       ├── SnowballChart.tsx           # Line chart visualization
│       ├── MonthlyBreakdown.tsx        # Expandable table
│       └── RecommendationCard.tsx      # AI-style recommendation
├── lib/
│   ├── calculations/
│   │   └── snowball.ts                 # Calculation engine
│   └── constants/
│       └── snowball.ts                 # Default values
├── types/
│   └── snowball.ts                     # TypeScript interfaces
└── app/
    └── snjoboltareiknivel/
        └── page.tsx                    # Route page
```

## Data Models

### Input Types

```typescript
// src/types/snowball.ts

export type LoanType = 'verdtryggd' | 'oVerdtryggd';
export type PaymentMethod = 'annuity' | 'linear';

export interface SnowballLoanInput {
  /** Original loan amount in ISK */
  originalLoanAmount: number;
  /** Current remaining balance in ISK */
  currentBalance: number;
  /** Annual nominal interest rate (decimal, e.g., 0.09 for 9%) */
  annualInterestRate: number;
  /** Original loan term in months */
  loanTermMonths: number;
  /** Remaining payments */
  remainingPayments: number;
  /** Loan type */
  loanType: LoanType;
  /** Payment method for óverðtryggð loans */
  paymentMethod?: PaymentMethod;
  /** Annual inflation rate for verðtryggð loans (decimal) */
  inflationRate?: number;
}

export interface SnowballInput {
  loan: SnowballLoanInput;
  /** Monthly extra payment amount in ISK */
  extraPayment: number;
  /** Expected annual investment return (decimal, e.g., 0.07 for 7%) */
  expectedInvestmentReturn: number;
  /** User's actual hourly wage for life energy calculations */
  actualHourlyWage?: number;
}
```

### Output Types

```typescript
export interface MonthlyRow {
  month: number;

  // Base case (extra payment only, no snowball)
  baseOpeningBalance: number;
  basePayment: number;
  baseInterest: number;
  basePrincipal: number;
  baseClosingBalance: number;

  // Snowball to loan
  snowballLoanOpeningBalance: number;
  snowballLoanPayment: number;
  snowballLoanExtraFromSavings: number;  // Accumulated interest savings added
  snowballLoanInterest: number;
  snowballLoanPrincipal: number;
  snowballLoanClosingBalance: number;

  // Snowball to investment
  snowballInvestOpeningBalance: number;
  snowballInvestPayment: number;
  snowballInvestInterest: number;
  snowballInvestPrincipal: number;
  snowballInvestClosingBalance: number;
  snowballInvestmentBalance: number;      // Investment account balance
  snowballInvestmentContribution: number; // Interest savings invested this month

  // Comparison
  interestSavingsThisMonth: number;  // Difference vs minimum payment
  cumulativeInterestSavings: number;
}

export interface ScenarioSummary {
  monthsToPayoff: number;
  totalInterestPaid: number;
  totalPayments: number;
  finalInvestmentBalance: number;
  totalWealthCreated: number;  // Debt eliminated + investment value
  lifeEnergyHours: {
    totalInterest: number;
    totalPayments: number;
    investmentGains: number;
    netBenefit: number;
  };
}

export interface SnowballResults {
  /** Monthly breakdown for all scenarios */
  monthlySchedule: MonthlyRow[];

  /** Scenario 1: Base case with extra payment */
  baseCase: ScenarioSummary;

  /** Scenario 2: Snowball interest savings to loan */
  snowballToLoan: ScenarioSummary;

  /** Scenario 3: Snowball interest savings to investment */
  snowballToInvestment: ScenarioSummary;

  /** Recommendation */
  recommendation: {
    bestScenario: 'base' | 'snowballLoan' | 'snowballInvest';
    isCloseCall: boolean;  // < 5% difference
    reasoning: string;
    lifeEnergyDifference: number;  // Hours difference between best and worst
  };
}
```

## Calculation Engine

### Algorithm: Three-Scenario Comparison

```typescript
// src/lib/calculations/snowball.ts

export function calculateSnowball(input: SnowballInput): SnowballResults {
  const { loan, extraPayment, expectedInvestmentReturn, actualHourlyWage } = input;

  // Calculate base monthly payment (without extra)
  const baseMonthlyPayment = calculateBasePayment(loan);

  // Initialize tracking variables
  const monthlySchedule: MonthlyRow[] = [];

  // Scenario balances
  let baseBalance = loan.currentBalance;
  let snowballLoanBalance = loan.currentBalance;
  let snowballInvestBalance = loan.currentBalance;
  let investmentBalance = 0;

  // Snowball accumulator (for loan scenario)
  let accumulatedSnowball = 0;

  // Monthly investment return rate
  const monthlyInvestReturn = Math.pow(1 + expectedInvestmentReturn, 1/12) - 1;

  // Monthly interest rate
  const monthlyInterestRate = loan.annualInterestRate / 12;

  let month = 0;

  // Continue until all loans are paid off
  while (baseBalance > 0 || snowballLoanBalance > 0 || snowballInvestBalance > 0) {
    month++;

    // Handle inflation for verðtryggð loans
    if (loan.loanType === 'verdtryggd' && loan.inflationRate) {
      const monthlyInflation = Math.pow(1 + loan.inflationRate, 1/12) - 1;
      baseBalance *= (1 + monthlyInflation);
      snowballLoanBalance *= (1 + monthlyInflation);
      snowballInvestBalance *= (1 + monthlyInflation);
    }

    // === SCENARIO 1: Base Case ===
    const baseInterest = baseBalance * monthlyInterestRate;
    const baseTotalPayment = Math.min(baseBalance + baseInterest, baseMonthlyPayment + extraPayment);
    const basePrincipal = baseTotalPayment - baseInterest;
    const baseNewBalance = Math.max(0, baseBalance - basePrincipal);

    // === SCENARIO 2: Snowball to Loan ===
    const snowballLoanInterest = snowballLoanBalance * monthlyInterestRate;
    // Interest savings = base interest - snowball loan interest (from previous month's lower balance)
    const interestSavings = Math.max(0, baseInterest - snowballLoanInterest);
    accumulatedSnowball += interestSavings;
    const snowballLoanTotalPayment = Math.min(
      snowballLoanBalance + snowballLoanInterest,
      baseMonthlyPayment + extraPayment + accumulatedSnowball
    );
    const snowballLoanPrincipal = snowballLoanTotalPayment - snowballLoanInterest;
    const snowballLoanNewBalance = Math.max(0, snowballLoanBalance - snowballLoanPrincipal);

    // === SCENARIO 3: Snowball to Investment ===
    const snowballInvestInterest = snowballInvestBalance * monthlyInterestRate;
    const snowballInvestTotalPayment = Math.min(
      snowballInvestBalance + snowballInvestInterest,
      baseMonthlyPayment + extraPayment
    );
    const snowballInvestPrincipal = snowballInvestTotalPayment - snowballInvestInterest;
    const snowballInvestNewBalance = Math.max(0, snowballInvestBalance - snowballInvestPrincipal);

    // Invest the interest savings
    const investContribution = Math.max(0, baseInterest - snowballInvestInterest);
    investmentBalance = investmentBalance * (1 + monthlyInvestReturn) + investContribution;

    // Record this month
    monthlySchedule.push({
      month,
      baseOpeningBalance: baseBalance,
      basePayment: baseTotalPayment,
      baseInterest,
      basePrincipal,
      baseClosingBalance: baseNewBalance,
      snowballLoanOpeningBalance: snowballLoanBalance,
      snowballLoanPayment: snowballLoanTotalPayment,
      snowballLoanExtraFromSavings: accumulatedSnowball,
      snowballLoanInterest,
      snowballLoanPrincipal,
      snowballLoanClosingBalance: snowballLoanNewBalance,
      snowballInvestOpeningBalance: snowballInvestBalance,
      snowballInvestPayment: snowballInvestTotalPayment,
      snowballInvestInterest,
      snowballInvestPrincipal,
      snowballInvestClosingBalance: snowballInvestNewBalance,
      snowballInvestmentBalance: investmentBalance,
      snowballInvestmentContribution: investContribution,
      interestSavingsThisMonth: interestSavings,
      cumulativeInterestSavings: accumulatedSnowball,
    });

    // Update balances
    baseBalance = baseNewBalance;
    snowballLoanBalance = snowballLoanNewBalance;
    snowballInvestBalance = snowballInvestNewBalance;

    // Safety: prevent infinite loops
    if (month > 600) break;
  }

  // Calculate summaries and recommendation
  return buildResults(monthlySchedule, investmentBalance, actualHourlyWage);
}
```

### Helper: Calculate Base Payment

```typescript
function calculateBasePayment(loan: SnowballLoanInput): number {
  const monthlyRate = loan.annualInterestRate / 12;

  if (loan.loanType === 'verdtryggd') {
    // Indexed loans: annuity on real rate
    const realMonthlyRate = monthlyRate; // Already real rate
    const n = loan.loanTermMonths;
    return loan.originalLoanAmount *
      (realMonthlyRate * Math.pow(1 + realMonthlyRate, n)) /
      (Math.pow(1 + realMonthlyRate, n) - 1);
  }

  if (loan.paymentMethod === 'linear') {
    // Linear: equal principal payments
    const principalPayment = loan.originalLoanAmount / loan.loanTermMonths;
    const interestPayment = loan.currentBalance * monthlyRate;
    return principalPayment + interestPayment;
  }

  // Annuity: equal total payments
  const n = loan.loanTermMonths;
  return loan.originalLoanAmount *
    (monthlyRate * Math.pow(1 + monthlyRate, n)) /
    (Math.pow(1 + monthlyRate, n) - 1);
}
```

### Helper: Build Results

```typescript
function buildResults(
  schedule: MonthlyRow[],
  finalInvestmentBalance: number,
  actualHourlyWage?: number
): SnowballResults {
  // Find payoff months
  const basePayoffMonth = schedule.findIndex(r => r.baseClosingBalance === 0) + 1;
  const snowballLoanPayoffMonth = schedule.findIndex(r => r.snowballLoanClosingBalance === 0) + 1;
  const snowballInvestPayoffMonth = schedule.findIndex(r => r.snowballInvestClosingBalance === 0) + 1;

  // Calculate totals
  const baseTotalInterest = schedule.reduce((sum, r) => sum + r.baseInterest, 0);
  const snowballLoanTotalInterest = schedule.reduce((sum, r) => sum + r.snowballLoanInterest, 0);
  const snowballInvestTotalInterest = schedule.reduce((sum, r) => sum + r.snowballInvestInterest, 0);

  const baseTotalPayments = schedule.reduce((sum, r) => sum + r.basePayment, 0);
  const snowballLoanTotalPayments = schedule.reduce((sum, r) => sum + r.snowballLoanPayment, 0);
  const snowballInvestTotalPayments = schedule.reduce((sum, r) => sum + r.snowballInvestPayment, 0);

  // Original debt = wealth created when paid off
  const originalDebt = schedule[0].baseOpeningBalance;

  // Calculate life energy if wage provided
  const toLifeEnergy = (amount: number) => actualHourlyWage ? amount / actualHourlyWage : 0;

  const baseCase: ScenarioSummary = {
    monthsToPayoff: basePayoffMonth,
    totalInterestPaid: baseTotalInterest,
    totalPayments: baseTotalPayments,
    finalInvestmentBalance: 0,
    totalWealthCreated: originalDebt, // Debt eliminated
    lifeEnergyHours: {
      totalInterest: toLifeEnergy(baseTotalInterest),
      totalPayments: toLifeEnergy(baseTotalPayments),
      investmentGains: 0,
      netBenefit: toLifeEnergy(originalDebt - baseTotalInterest),
    },
  };

  const snowballToLoan: ScenarioSummary = {
    monthsToPayoff: snowballLoanPayoffMonth,
    totalInterestPaid: snowballLoanTotalInterest,
    totalPayments: snowballLoanTotalPayments,
    finalInvestmentBalance: 0,
    totalWealthCreated: originalDebt,
    lifeEnergyHours: {
      totalInterest: toLifeEnergy(snowballLoanTotalInterest),
      totalPayments: toLifeEnergy(snowballLoanTotalPayments),
      investmentGains: 0,
      netBenefit: toLifeEnergy(originalDebt - snowballLoanTotalInterest),
    },
  };

  const snowballToInvestment: ScenarioSummary = {
    monthsToPayoff: snowballInvestPayoffMonth,
    totalInterestPaid: snowballInvestTotalInterest,
    totalPayments: snowballInvestTotalPayments,
    finalInvestmentBalance,
    totalWealthCreated: originalDebt + finalInvestmentBalance,
    lifeEnergyHours: {
      totalInterest: toLifeEnergy(snowballInvestTotalInterest),
      totalPayments: toLifeEnergy(snowballInvestTotalPayments),
      investmentGains: toLifeEnergy(finalInvestmentBalance),
      netBenefit: toLifeEnergy(originalDebt - snowballInvestTotalInterest + finalInvestmentBalance),
    },
  };

  // Determine recommendation
  const scenarios = [
    { name: 'base' as const, summary: baseCase },
    { name: 'snowballLoan' as const, summary: snowballToLoan },
    { name: 'snowballInvest' as const, summary: snowballToInvestment },
  ];

  scenarios.sort((a, b) => b.summary.totalWealthCreated - a.summary.totalWealthCreated);
  const best = scenarios[0];
  const worst = scenarios[2];

  const percentDifference = (best.summary.totalWealthCreated - scenarios[1].summary.totalWealthCreated)
    / best.summary.totalWealthCreated * 100;

  const isCloseCall = percentDifference < 5;

  const lifeEnergyDifference = best.summary.lifeEnergyHours.netBenefit - worst.summary.lifeEnergyHours.netBenefit;

  return {
    monthlySchedule: schedule,
    baseCase,
    snowballToLoan,
    snowballToInvestment,
    recommendation: {
      bestScenario: best.name,
      isCloseCall,
      reasoning: generateReasoning(best.name, isCloseCall, lifeEnergyDifference),
      lifeEnergyDifference,
    },
  };
}
```

## Component Design

### SnowballCalculatorPage

Main orchestrator component.

```tsx
// src/components/snowball/SnowballCalculatorPage.tsx

export function SnowballCalculatorPage({ actualHourlyWage = 0 }: Props) {
  // State for loan input (can be pre-filled from Debt Payoff calculator)
  const [loan, setLoan] = useState<SnowballLoanInput>(getDefaultLoan());
  const [extraPayment, setExtraPayment] = useState(10_000);
  const [investmentReturn, setInvestmentReturn] = useState(0.07);

  // Calculate results
  const results = useMemo(() => {
    if (!actualHourlyWage) return null;
    return calculateSnowball({
      loan,
      extraPayment,
      expectedInvestmentReturn: investmentReturn,
      actualHourlyWage,
    });
  }, [loan, extraPayment, investmentReturn, actualHourlyWage]);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <h1>Vaxtasparnaður Snjóboltareiknivél</h1>

      {/* Input Cards */}
      <LoanInputCard loan={loan} onChange={setLoan} />
      <ExtraPaymentCard
        value={extraPayment}
        onChange={setExtraPayment}
        actualHourlyWage={actualHourlyWage}
      />
      <InvestmentCard value={investmentReturn} onChange={setInvestmentReturn} />

      {/* Results */}
      {results && (
        <>
          <ScenarioSummary results={results} />
          <SnowballChart results={results} />
          <RecommendationCard recommendation={results.recommendation} />
          <MonthlyBreakdown schedule={results.monthlySchedule} />
        </>
      )}
    </div>
  );
}
```

### ScenarioSummary

Three-card comparison showing all scenarios.

```tsx
// src/components/snowball/ScenarioSummary.tsx

export function ScenarioSummary({ results }: { results: SnowballResults }) {
  const scenarios = [
    {
      title: 'Grunnur',
      subtitle: 'Aukagreiðsla eingöngu',
      data: results.baseCase,
      color: 'gray',
    },
    {
      title: 'Snjóbolti → Lán',
      subtitle: 'Vaxtasparnaður á lán',
      data: results.snowballToLoan,
      color: 'blue',
    },
    {
      title: 'Snjóbolti → Fjárfesting',
      subtitle: 'Vaxtasparnaður fjárfestur',
      data: results.snowballToInvestment,
      color: 'green',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {scenarios.map((scenario) => (
        <Card key={scenario.title} className={`border-${scenario.color}-200`}>
          <CardHeader>
            <h3>{scenario.title}</h3>
            <p className="text-sm text-gray-600">{scenario.subtitle}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Stat
                label="Mánuðir til skuldleysi"
                value={scenario.data.monthsToPayoff}
                suffix=" mán"
              />
              <Stat
                label="Heildarvextir greiddir"
                value={scenario.data.totalInterestPaid}
                format="currency"
              />
              {scenario.data.finalInvestmentBalance > 0 && (
                <Stat
                  label="Fjárfestingarvirði"
                  value={scenario.data.finalInvestmentBalance}
                  format="currency"
                  color="green"
                />
              )}
              <Stat
                label="Heildarauður skapaður"
                value={scenario.data.totalWealthCreated}
                format="currency"
                highlight
              />
              <Stat
                label="Lífsorka (sparnaður)"
                value={scenario.data.lifeEnergyHours.netBenefit}
                suffix=" klst"
                color="purple"
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

### SnowballChart

Line chart showing all three scenarios over time.

```tsx
// src/components/snowball/SnowballChart.tsx

export function SnowballChart({ results }: { results: SnowballResults }) {
  const chartData = results.monthlySchedule.map((row) => ({
    month: row.month,
    base: row.baseClosingBalance,
    snowballLoan: row.snowballLoanClosingBalance,
    snowballInvest: row.snowballInvestClosingBalance + row.snowballInvestmentBalance,
    investment: row.snowballInvestmentBalance,
  }));

  return (
    <Card>
      <CardHeader>
        <h3>Þróun yfir tíma</h3>
      </CardHeader>
      <CardContent>
        {/* Debt Balance Chart */}
        <div className="h-64">
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" label="Mánuðir" />
              <YAxis tickFormatter={formatMillions} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                dataKey="base"
                name="Grunnur"
                stroke="#6b7280"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="snowballLoan"
                name="Snjóbolti → Lán"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="snowballInvest"
                name="Snjóbolti → Fjárfesting (skuld)"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="investment"
                name="Fjárfesting"
                stroke="#22c55e"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Cumulative Interest Savings Chart */}
        <div className="h-48 mt-6">
          <h4>Uppsafnaður vaxtasparnaður</h4>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              {/* ... similar structure */}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
```

### RecommendationCard

Clear recommendation with reasoning.

```tsx
// src/components/snowball/RecommendationCard.tsx

export function RecommendationCard({ recommendation }: Props) {
  const scenarioNames = {
    base: 'Grunnur (aukagreiðsla eingöngu)',
    snowballLoan: 'Snjóbolti á lán',
    snowballInvest: 'Snjóbolti í fjárfestingu',
  };

  return (
    <Card className={recommendation.isCloseCall ? 'border-yellow-300' : 'border-green-300'}>
      <CardHeader>
        <h3>Tilmæli</h3>
        {recommendation.isCloseCall && (
          <Badge variant="warning">Jafntefli - persónuleg val</Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold mb-4">
          {scenarioNames[recommendation.bestScenario]}
        </div>
        <p className="text-gray-700 mb-4">{recommendation.reasoning}</p>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-sm text-purple-700">Munur í lífsorku</div>
          <div className="text-2xl font-bold text-purple-900">
            {recommendation.lifeEnergyDifference.toFixed(1)} klst
          </div>
          <div className="text-xs text-purple-600">
            meira frítíma á ævinni
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

### MonthlyBreakdown

Expandable table showing month-by-month details.

```tsx
// src/components/snowball/MonthlyBreakdown.tsx

export function MonthlyBreakdown({ schedule }: { schedule: MonthlyRow[] }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<'base' | 'loan' | 'invest'>('base');

  const displayRows = expanded ? schedule : schedule.slice(0, 12);

  return (
    <Card>
      <CardHeader>
        <h3>Sundurliðun eftir mánuðum</h3>
        <Select
          value={selectedScenario}
          onChange={setSelectedScenario}
          options={[
            { value: 'base', label: 'Grunnur' },
            { value: 'loan', label: 'Snjóbolti → Lán' },
            { value: 'invest', label: 'Snjóbolti → Fjárfesting' },
          ]}
        />
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th>Mán</th>
                <th>Opnunarstaða</th>
                <th>Greiðsla</th>
                <th>Vextir</th>
                <th>Afborgun</th>
                <th>Lokastaða</th>
                {selectedScenario === 'invest' && <th>Fjárfesting</th>}
                <th>Vaxtasparnaður</th>
              </tr>
            </thead>
            <tbody>
              {displayRows.map((row) => (
                <tr key={row.month}>
                  {/* Render based on selectedScenario */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {schedule.length > 12 && (
          <Button
            variant="ghost"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Sýna minna' : `Sýna allt (${schedule.length} mánuði)`}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
```

## Integration Points

### Pre-fill from Debt Payoff Calculator

```typescript
// In DebtPayoffPage.tsx, add navigation link
<Link
  href={`/snjoboltareiknivel?${encodeURIComponent(JSON.stringify(debt))}`}
  className="text-indigo-600"
>
  Skoða snjóboltaáhrif →
</Link>

// In SnowballCalculatorPage.tsx, read query params
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const prefilledData = params.get('data');
  if (prefilledData) {
    try {
      const parsed = JSON.parse(decodeURIComponent(prefilledData));
      setLoan(mapDebtInputToSnowballLoan(parsed));
    } catch (e) {
      // Ignore invalid data
    }
  }
}, []);
```

### Life Energy Integration

```typescript
// Uses same actual hourly wage from localStorage
// Displayed in all monetary outputs
// Prominent "klst" display throughout
```

## Error Handling

### Input Validation

```typescript
export function validateSnowballInput(input: SnowballInput): ValidationResult {
  const errors: string[] = [];

  if (input.loan.currentBalance <= 0) {
    errors.push('Núverandi staða verður að vera stærri en 0');
  }

  if (input.loan.annualInterestRate <= 0 || input.loan.annualInterestRate > 1) {
    errors.push('Vextir verða að vera á milli 0% og 100%');
  }

  if (input.extraPayment < 0) {
    errors.push('Aukagreiðsla má ekki vera neikvæð');
  }

  if (input.expectedInvestmentReturn < 0 || input.expectedInvestmentReturn > 0.5) {
    errors.push('Vænt ávöxtun verður að vera á milli 0% og 50%');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
```

### Edge Cases

1. **Loan already paid off**: Show message, disable calculations
2. **Extra payment > loan balance**: Cap at remaining balance
3. **Investment return very high**: Show warning about unrealistic assumptions
4. **Very long loan term**: Virtualize table, limit to 600 months

## Testing Strategy

### Unit Tests

```typescript
// snowball.test.ts

describe('calculateSnowball', () => {
  it('calculates base case correctly', () => {
    const result = calculateSnowball({
      loan: { currentBalance: 1_000_000, annualInterestRate: 0.09, ... },
      extraPayment: 10_000,
      expectedInvestmentReturn: 0.07,
    });

    expect(result.baseCase.monthsToPayoff).toBeGreaterThan(0);
    expect(result.baseCase.totalInterestPaid).toBeGreaterThan(0);
  });

  it('snowball to loan pays off faster than base', () => {
    const result = calculateSnowball(standardInput);
    expect(result.snowballToLoan.monthsToPayoff)
      .toBeLessThanOrEqual(result.baseCase.monthsToPayoff);
  });

  it('snowball to investment creates more wealth when returns exceed loan rate', () => {
    const result = calculateSnowball({
      ...standardInput,
      loan: { ...standardInput.loan, annualInterestRate: 0.05 },
      expectedInvestmentReturn: 0.10,
    });

    expect(result.snowballToInvestment.totalWealthCreated)
      .toBeGreaterThan(result.snowballToLoan.totalWealthCreated);
  });

  it('handles indexed loans with inflation', () => {
    const result = calculateSnowball({
      ...standardInput,
      loan: {
        ...standardInput.loan,
        loanType: 'verdtryggd',
        inflationRate: 0.05,
      },
    });

    expect(result.baseCase.monthsToPayoff).toBeGreaterThan(0);
  });
});
```

### Component Tests

```typescript
// SnowballCalculatorPage.test.tsx

describe('SnowballCalculatorPage', () => {
  it('renders input forms', () => {
    render(<SnowballCalculatorPage actualHourlyWage={5000} />);
    expect(screen.getByLabelText(/núverandi staða/i)).toBeInTheDocument();
  });

  it('shows results when inputs are valid', () => {
    render(<SnowballCalculatorPage actualHourlyWage={5000} />);
    // Fill inputs...
    expect(screen.getByText(/tilmæli/i)).toBeInTheDocument();
  });

  it('shows warning when actual hourly wage is missing', () => {
    render(<SnowballCalculatorPage actualHourlyWage={0} />);
    expect(screen.getByText(/verður að reikna/i)).toBeInTheDocument();
  });
});
```

## Accessibility

- All charts have aria-labels describing the data
- Table has proper headers with scope attributes
- Color choices pass WCAG contrast (red #ef4444, green #22c55e on white)
- Interactive elements have focus states
- Screen reader text for icons and visual indicators

## Performance

- Memoize calculation results with useMemo
- Virtualize table if > 60 rows visible
- Debounce input changes (300ms)
- Charts render within 1 second for 600 months of data

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| Three scenarios in parallel | Easier comparison than sequential presentation |
| Life energy as primary metric | Aligns with FIRE philosophy and app theme |
| Default 7% investment return | Historical stock market average |
| Expandable monthly table | Don't overwhelm with data, but make available |
| Recommendation with "close call" | Acknowledge when personal preference matters |
| Pre-fill from Debt Payoff | Smooth user journey, reduce re-entry |

## Future Enhancements

1. **Multiple debts**: Track snowball across multiple loans
2. **Custom snowball schedule**: User defines when to add savings
3. **Tax implications**: Consider capital gains on investments
4. **Scenario export**: Save/share comparison as PDF or image
