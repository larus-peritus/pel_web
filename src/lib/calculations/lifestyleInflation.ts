/**
 * Lifestyle Inflation Calculations
 * Core calculation functions for analyzing lifestyle creep and FI impact
 */

import type {
  Period,
  SpendingData,
  SpendingCategory,
  InflationScore,
  CategoryChange,
  ChangeSeverity,
  FIImpact,
  SalaryUtilization,
  InflationAnalysis,
  InflationAlert,
} from '@/types/calculator';
import { getTotalSpending } from '@/lib/utils/periodHelpers';
import {
  SPENDING_CATEGORY_LABELS,
  SPENDING_CATEGORIES,
} from '@/lib/constants/spendingCategories';
import { dollarsToLifeEnergy } from './lifeEnergy';
import { calculateFutureValue } from './subscriptions';
import { formatCurrency } from '@/lib/utils/formatters';

/**
 * Calculate inflation score from lifestyle creep percentage
 * @param lifestyleCreep - Lifestyle creep percentage
 * @returns Inflation score level
 */
export function calculateInflationScore(lifestyleCreep: number): InflationScore {
  if (lifestyleCreep < 5) return 'healthy';
  if (lifestyleCreep < 15) return 'caution';
  if (lifestyleCreep < 30) return 'warning';
  return 'critical';
}

/**
 * Calculate change severity from percentage change
 * @param changePercent - Percentage change
 * @returns Severity level
 */
export function calculateChangeSeverity(changePercent: number): ChangeSeverity {
  if (changePercent < 0) return 'decrease';
  if (changePercent < 5) return 'stable';
  if (changePercent < 15) return 'minor';
  if (changePercent < 30) return 'moderate';
  return 'major';
}

/**
 * Analyze changes in each spending category
 * @param current - Current spending data
 * @param comparison - Comparison spending data
 * @param actualHourlyWage - Optional actual hourly wage for life energy calculations
 * @returns Array of category changes
 */
export function analyzeCategoryChanges(
  current: SpendingData,
  comparison: SpendingData,
  actualHourlyWage?: number
): CategoryChange[] {
  return SPENDING_CATEGORIES.map((category) => {
    const oldAmount = comparison[category];
    const newAmount = current[category];
    const change = newAmount - oldAmount;
    const changePercent = oldAmount > 0 ? (change / oldAmount) * 100 : 0;

    // Calculate life energy cost of change (annual)
    const lifeEnergyHours =
      actualHourlyWage && actualHourlyWage > 0
        ? dollarsToLifeEnergy(Math.abs(change) * 12, actualHourlyWage)
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

/**
 * Detect "quiet upgrades" - small increases that add up
 * @param categoryChanges - Array of category changes
 * @returns Array of quiet upgrade categories
 */
export function detectQuietUpgrades(categoryChanges: CategoryChange[]): CategoryChange[] {
  return categoryChanges.filter(
    (change) =>
      change.changePercent > 10 &&
      change.changePercent < 30 &&
      change.change > 5000 // More than 5,000 kr/month increase
  );
}

/**
 * Calculate FI impact of lifestyle inflation
 * @param monthlySpendingChange - Monthly spending change
 * @param currentIncome - Current monthly income
 * @returns FI impact details
 */
export function calculateFIImpact(
  monthlySpendingChange: number,
  currentIncome: number
): FIImpact {
  const increasedAnnualExpenses = monthlySpendingChange * 12;
  const increasedFITarget = increasedAnnualExpenses * 25; // 4% rule

  // Estimated annual savings (30% of income)
  const estimatedAnnualSavings = currentIncome * 12 * 0.3;
  const fiDelayYears =
    estimatedAnnualSavings > 0 ? increasedFITarget / estimatedAnnualSavings : 0;

  const fiDelayMonths = Math.round(fiDelayYears * 12);

  // Future value at 7% return
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

/**
 * Calculate salary utilization (how raise is used)
 * @param incomeIncrease - Monthly income increase
 * @param expenseIncrease - Monthly expense increase
 * @returns Salary utilization details
 */
export function calculateSalaryUtilization(
  incomeIncrease: number,
  expenseIncrease: number
): SalaryUtilization {
  const savingsIncrease = incomeIncrease - expenseIncrease;
  const utilizationPercent =
    incomeIncrease > 0 ? (expenseIncrease / incomeIncrease) * 100 : 0;

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

/**
 * Get suggestions for a specific category
 * @param category - Spending category
 * @returns Array of suggestion strings
 */
export function getSuggestionsForCategory(category: SpendingCategory): string[] {
  const suggestions: Record<SpendingCategory, string[]> = {
    housing: [
      'Íhugaðu ódýrara húsnæði eða herbergisleigju',
      'Leitaðu að lægri vöxtum fyrir veð',
      'Lækkaðu rafmagnsnotkun með LED og betri einangrun',
    ],
    food: [
      'Skipulagðu máltíðir fyrirfram',
      'Eldaðu heima 2 sinnum í viðbót á viku',
      'Kauptu í lausu í stað einstaklingspakkningar',
    ],
    transportation: [
      'Íhugaðu hjólreiðar eða gang hluta leiðar',
      'Notaðu samgöngur í stað bíls þar sem hægt er',
      'Skiptu um bíl í sparneytni eða rafbíl',
    ],
    subscriptions: [
      'Farðu yfir allar áskriftir og segðu upp ónotuðum',
      'Skiptu áskriftum með fjölskyldu/vinum',
      'Skiptu milli streymisþjónustu í stað þess að hafa allar',
    ],
    convenience: [
      'Undirbúðu máltíðir um helgar til að forðast skyndikaupur',
      'Settu þér reglu: bíddu 24 klst áður en þú kaupir',
      'Notaðu lista þegar þú ferð í búð',
    ],
    clothing: [
      'Kauptu aðeins það sem þú þarft',
      'Íhugaðu notað frekar en nýtt',
      'Bíddu eftir útsölum fyrir stór kaup',
    ],
    entertainment: [
      'Leitaðu að ókeypis valkostum (bókasafn, gönguferðir)',
      'Takmarkaðu útgjöld til X kr á mánuði',
      'Finndu ódýra áhugamál',
    ],
    health: [
      'Athugaðu hvort sjúkratrygging þín nái yfir kostnað',
      'Íhugaðu forvarnarmeðferð til að forðast dýrari vandamál',
      'Notaðu almennar vörur í stað vörumerkja',
    ],
    other: [
      'Flokkaklárt þessa útgjöld betur',
      'Greindu hvað fellur undir "annað"',
      'Settu þér mörk fyrir þennan flokk',
    ],
  };

  return suggestions[category] || [];
}

/**
 * Generate unique alert ID
 */
function generateAlertId(): string {
  return `alert-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Generate alerts based on analysis
 * @param lifestyleCreep - Lifestyle creep percentage
 * @param categoryChanges - Array of category changes
 * @param fiImpact - FI impact details
 * @param salaryUtilization - Optional salary utilization
 * @returns Array of alerts
 */
export function generateAlerts(
  lifestyleCreep: number,
  categoryChanges: CategoryChange[],
  fiImpact: FIImpact,
  salaryUtilization?: SalaryUtilization
): InflationAlert[] {
  const alerts: InflationAlert[] = [];

  // Overall lifestyle inflation alerts
  if (lifestyleCreep > 30) {
    alerts.push({
      id: generateAlertId(),
      type: 'critical',
      message: 'Alvarleg lífsstílsverðbólga greind',
      detail: `Útgjöldin þín hafa aukist um ${lifestyleCreep.toFixed(1)}% umfram tekjuaukningu.`,
      fiImpact: `Þetta seinkar FI um ${fiImpact.fiDelayYears.toFixed(1)} ár.`,
      suggestions: [
        'Farðu yfir öll tímabil og greindu hvar aukningin kemur frá',
        'Íhugaðu að frysta útgjöld í 3-6 mánuði til að endurheimta stýringu',
        'Settu þér fjárhagsáætlun fyrir hvern flokk',
      ],
      canDismiss: false,
      dismissed: false,
    });
  } else if (lifestyleCreep > 15) {
    alerts.push({
      id: generateAlertId(),
      type: 'warning',
      message: 'Umtalsverð lífsstílsverðbólga',
      detail: `Útgjöldin þín hafa aukist um ${lifestyleCreep.toFixed(1)}% umfram tekjuaukningu.`,
      fiImpact: `Þetta kostar þig ${fiImpact.fiDelayMonths} mánuði í FI seinkun.`,
      suggestions: [
        'Greindu flokka með stærstu hækkunum',
        'Íhugaðu að lækka 1-2 flokka aftur í fyrra stig',
      ],
      canDismiss: true,
      dismissed: false,
    });
  }

  // Category-specific alerts
  categoryChanges
    .filter((change) => change.severity === 'major')
    .forEach((change) => {
      alerts.push({
        id: generateAlertId(),
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

  // Salary utilization alert
  if (salaryUtilization && salaryUtilization.status === 'critical') {
    alerts.push({
      id: generateAlertId(),
      type: 'critical',
      message: `${salaryUtilization.utilizationPercent.toFixed(0)}% af launahækkun fór í lífsstíl`,
      detail: `Af ${formatCurrency(salaryUtilization.incomeIncrease)} tekjuaukningu fór aðeins ${formatCurrency(salaryUtilization.savingsIncrease)} í sparnað.`,
      fiImpact: `Þú gætir verið kominn í FI ${fiImpact.fiDelayYears.toFixed(1)} árum fyrr.`,
      suggestions: [
        'Reyndu að halda útgjöldum föstum næstu 3-6 mánuði',
        'Flyttu alla tekjuaukningu beint í sparnað',
        'Settu upp sjálfvirka millifærslu í sparnað',
      ],
      canDismiss: true,
      dismissed: false,
    });
  }

  return alerts;
}

/**
 * Create empty analysis for first period
 * @param currentPeriod - The first period
 * @returns Empty analysis
 */
export function createEmptyAnalysis(currentPeriod: Period): InflationAnalysis {
  return {
    currentPeriod,
    comparisonPeriod: null,
    totalSpendingChange: 0,
    totalSpendingChangePercent: 0,
    incomeChange: 0,
    incomeChangePercent: 0,
    lifestyleCreep: 0,
    inflationScore: 'healthy',
    categoryChanges: [],
    quietUpgrades: [],
    fiImpact: {
      increasedAnnualExpenses: 0,
      increasedFITarget: 0,
      fiDelayYears: 0,
      fiDelayMonths: 0,
      lostFutureValue10Years: 0,
      lostFutureValue20Years: 0,
    },
    salaryUtilization: undefined,
    alerts: [],
  };
}

/**
 * Main analysis function - analyze lifestyle inflation between periods
 * @param currentPeriod - Current period
 * @param comparisonPeriod - Comparison period (previous)
 * @param actualHourlyWage - Optional actual hourly wage
 * @returns Complete inflation analysis
 */
export function analyzeInflation(
  currentPeriod: Period,
  comparisonPeriod: Period | null,
  actualHourlyWage?: number
): InflationAnalysis {
  // If no comparison period, return empty analysis
  if (!comparisonPeriod) {
    return createEmptyAnalysis(currentPeriod);
  }

  // Calculate total spending changes
  const currentTotal = getTotalSpending(currentPeriod.spending);
  const comparisonTotal = getTotalSpending(comparisonPeriod.spending);
  const totalSpendingChange = currentTotal - comparisonTotal;
  const totalSpendingChangePercent =
    comparisonTotal > 0 ? (totalSpendingChange / comparisonTotal) * 100 : 0;

  // Calculate income changes
  const incomeChange = currentPeriod.income - comparisonPeriod.income;
  const incomeChangePercent =
    comparisonPeriod.income > 0 ? (incomeChange / comparisonPeriod.income) * 100 : 0;

  // Calculate lifestyle creep
  const lifestyleCreep = totalSpendingChangePercent - incomeChangePercent;
  const inflationScore = calculateInflationScore(lifestyleCreep);

  // Analyze category changes
  const categoryChanges = analyzeCategoryChanges(
    currentPeriod.spending,
    comparisonPeriod.spending,
    actualHourlyWage
  );

  // Detect quiet upgrades
  const quietUpgrades = detectQuietUpgrades(categoryChanges);

  // Calculate FI impact
  const fiImpact = calculateFIImpact(totalSpendingChange, currentPeriod.income);

  // Calculate salary utilization if income increased
  const salaryUtilization =
    incomeChange > 0
      ? calculateSalaryUtilization(incomeChange, totalSpendingChange)
      : undefined;

  // Generate alerts
  const alerts = generateAlerts(lifestyleCreep, categoryChanges, fiImpact, salaryUtilization);

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
