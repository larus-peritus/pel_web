/**
 * Withdrawal Sequence Optimizer Calculations
 *
 * Helps users optimize withdrawal order across account types for Iceland:
 * - Taxable accounts (22% capital gains)
 * - Séreign (doesn't affect TR!)
 * - Occupational pension (affects TR means-testing)
 *
 * Key Iceland insight: Séreign withdrawals don't count against TR,
 * making it optimal to use séreign before occupational pension.
 */

import { TR_MEANS_TEST, ICELAND_PENSION_AGES } from '@/lib/constants/fiNumber';

/**
 * Account types for withdrawal sequencing
 */
export type AccountType = 'taxable' | 'sereign' | 'occupational' | 'tr';

/**
 * Account balance and characteristics
 */
export interface AccountBalance {
  type: AccountType;
  balance: number;
  monthlyIncome?: number; // For pension accounts
  expectedReturn?: number; // Annual return rate
}

/**
 * Withdrawal plan for a single year
 */
export interface YearlyWithdrawalPlan {
  age: number;
  withdrawals: {
    type: AccountType;
    amount: number;
    taxPaid: number;
    trImpact: number; // How much this reduces TR
  }[];
  totalWithdrawal: number;
  totalTaxPaid: number;
  trPensionReceived: number;
  netIncome: number;
  endingBalances: Record<AccountType, number>;
}

/**
 * Complete withdrawal sequence result
 */
export interface WithdrawalSequenceResult {
  yearlyPlans: YearlyWithdrawalPlan[];
  totalTaxPaid: number;
  totalTRReceived: number;
  portfolioSurvivalYears: number;
  optimalSequenceUsed: boolean;
  recommendations: string[];
}

/**
 * Input for withdrawal sequence optimization
 */
export interface WithdrawalSequenceInput {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  monthlyExpenses: number;
  accounts: {
    taxable: number;
    sereign: number;
    occupationalMonthly: number; // Monthly pension at 67
  };
  expectedReturns: {
    taxable: number;
    sereign: number;
  };
  inflationRate: number;
}

/**
 * Iceland income tax brackets (2024)
 */
const ICELAND_TAX_BRACKETS = [
  { threshold: 0, rate: 0.3145 }, // 31.45% up to 446,136
  { threshold: 446136, rate: 0.3795 }, // 37.95% from 446,136 to 1,252,501
  { threshold: 1252501, rate: 0.4645 }, // 46.45% above 1,252,501
];

/**
 * Personal tax credit (monthly)
 */
const PERSONAL_TAX_CREDIT_MONTHLY = 64926; // ~64,926 ISK/month in 2024

/**
 * Capital gains tax rate
 */
const CAPITAL_GAINS_TAX_RATE = 0.22;

/**
 * Calculate income tax for a given monthly income
 */
export function calculateIncomeTax(monthlyIncome: number): number {
  const annualIncome = monthlyIncome * 12;
  let tax = 0;
  let remainingIncome = annualIncome;

  for (let i = ICELAND_TAX_BRACKETS.length - 1; i >= 0; i--) {
    const bracket = ICELAND_TAX_BRACKETS[i];
    if (remainingIncome > bracket.threshold) {
      const taxableInBracket = remainingIncome - bracket.threshold;
      tax += taxableInBracket * bracket.rate;
      remainingIncome = bracket.threshold;
    }
  }

  // Apply personal tax credit
  const annualCredit = PERSONAL_TAX_CREDIT_MONTHLY * 12;
  const effectiveTax = Math.max(0, tax - annualCredit);

  return effectiveTax / 12; // Return monthly tax
}

/**
 * Calculate capital gains tax on withdrawal
 * Assumes 50% of withdrawal is gains (simplified)
 */
export function calculateCapitalGainsTax(
  withdrawal: number,
  gainPercentage: number = 0.5
): number {
  const gains = withdrawal * gainPercentage;
  return gains * CAPITAL_GAINS_TAX_RATE;
}

/**
 * Calculate TR pension given other income
 */
export function calculateTRPension(
  occupationalPension: number,
  otherCountableIncome: number = 0,
  isSingle: boolean = true
): number {
  const maxTR = isSingle
    ? TR_MEANS_TEST.MAX_MONTHLY_SINGLE
    : TR_MEANS_TEST.MAX_MONTHLY_COUPLE;

  // Séreign doesn't count!
  const totalCountable = occupationalPension + otherCountableIncome;

  if (totalCountable <= TR_MEANS_TEST.INCOME_EXEMPTION) {
    return maxTR;
  }

  const incomeAboveExemption = totalCountable - TR_MEANS_TEST.INCOME_EXEMPTION;
  const reduction = incomeAboveExemption * TR_MEANS_TEST.REDUCTION_RATE;

  return Math.max(0, Math.round(maxTR - reduction));
}

/**
 * Determine optimal withdrawal sequence for Iceland
 *
 * Optimal order:
 * 1. Taxable accounts (ages < 60) - Only option before 60
 * 2. Séreign (ages 60-66) - Doesn't affect TR!
 * 3. TR pension (age 67+) - Get this first, it's "free" based on other income
 * 4. Occupational pension last - Affects TR means-testing
 *
 * Special consideration: After 67, want to minimize occupational pension
 * usage to maximize TR benefits.
 */
export function getOptimalWithdrawalOrder(age: number): AccountType[] {
  if (age < 60) {
    return ['taxable'];
  } else if (age < 67) {
    return ['sereign', 'taxable'];
  } else {
    // After 67: TR first (automatic), then séreign (doesn't affect TR),
    // then taxable, then occupational (affects TR)
    return ['tr', 'sereign', 'taxable', 'occupational'];
  }
}

/**
 * Calculate withdrawal plan for a single year
 *
 * IMPORTANT: At age 67+, lífeyrissjóður (occupational pension) is AUTOMATIC income.
 * You cannot choose not to receive it. TR is calculated based on this automatic income.
 * Séreign withdrawals do NOT affect TR - this is the key optimization opportunity.
 */
export function calculateYearlyWithdrawal(
  age: number,
  monthlyExpenses: number,
  balances: Record<AccountType, number>,
  occupationalMonthlyPension: number
): YearlyWithdrawalPlan {
  const annualExpenses = monthlyExpenses * 12;
  const withdrawals: YearlyWithdrawalPlan['withdrawals'] = [];
  let remainingNeed = annualExpenses;
  const newBalances = { ...balances };

  // At age 67+, occupational pension and TR are AUTOMATIC income
  let trPension = 0;
  let occupationalIncome = 0;

  if (age >= ICELAND_PENSION_AGES.OCCUPATIONAL_STANDARD_AGE) {
    // Occupational pension is automatic - you WILL receive it
    occupationalIncome = occupationalMonthlyPension * 12;

    // TR is calculated based on your occupational pension (automatic income)
    // Séreign withdrawals do NOT count against TR!
    trPension = calculateTRPension(occupationalMonthlyPension, 0) * 12;

    // Record the automatic occupational pension
    if (occupationalIncome > 0) {
      const occTax = calculateIncomeTax(occupationalMonthlyPension) * 12;
      withdrawals.push({
        type: 'occupational',
        amount: occupationalIncome,
        taxPaid: occTax,
        trImpact: 0, // It's automatic, not a choice
      });
      remainingNeed -= (occupationalIncome - occTax);
    }

    // TR is also automatic income
    if (trPension > 0) {
      // TR is taxed as income
      const trTax = calculateIncomeTax(trPension / 12) * 12;
      withdrawals.push({
        type: 'tr',
        amount: trPension,
        taxPaid: trTax,
        trImpact: 0,
      });
      remainingNeed -= (trPension - trTax);
    }
  }

  // Now handle discretionary withdrawals from savings (if still needed)
  // At 60-66: Can use séreign (doesn't affect future TR)
  // Any age: Can use taxable savings

  if (remainingNeed > 0) {
    // Séreign - available from age 60, doesn't affect TR
    if (age >= 60 && newBalances.sereign > 0) {
      const available = newBalances.sereign;
      const withdrawal = Math.min(remainingNeed, available);
      // Séreign is taxed as income but often at lower bracket in retirement
      const taxPaid = calculateIncomeTax(withdrawal / 12) * 12 * 0.5; // Simplified
      newBalances.sereign -= withdrawal;

      withdrawals.push({
        type: 'sereign',
        amount: withdrawal,
        taxPaid,
        trImpact: 0, // Key: NO TR impact!
      });
      remainingNeed -= (withdrawal - taxPaid);
    }

    // Taxable savings - available any time
    if (remainingNeed > 0 && newBalances.taxable > 0) {
      const available = newBalances.taxable;
      const withdrawal = Math.min(remainingNeed / (1 - CAPITAL_GAINS_TAX_RATE * 0.5), available);
      const taxPaid = calculateCapitalGainsTax(withdrawal);
      newBalances.taxable -= withdrawal;

      withdrawals.push({
        type: 'taxable',
        amount: withdrawal,
        taxPaid,
        trImpact: 0,
      });
      remainingNeed -= (withdrawal - taxPaid);
    }
  }

  const totalWithdrawal = withdrawals.reduce((sum, w) => sum + w.amount, 0);
  const totalTaxPaid = withdrawals.reduce((sum, w) => sum + w.taxPaid, 0);

  return {
    age,
    withdrawals,
    totalWithdrawal,
    totalTaxPaid,
    trPensionReceived: trPension,
    netIncome: totalWithdrawal - totalTaxPaid,
    endingBalances: newBalances,
  };
}

/**
 * Generate complete withdrawal sequence plan
 *
 * Key insight: After age 67, even if savings are depleted, you may be fine
 * if pensions (lífeyrissjóður + TR) cover your expenses.
 */
export function generateWithdrawalSequence(
  input: WithdrawalSequenceInput
): WithdrawalSequenceResult {
  const yearlyPlans: YearlyWithdrawalPlan[] = [];
  let totalTaxPaid = 0;
  let totalTRReceived = 0;

  // Initialize balances
  let balances: Record<AccountType, number> = {
    taxable: input.accounts.taxable,
    sereign: input.accounts.sereign,
    occupational: 0, // This is a pension stream, not a balance
    tr: 0, // This is a pension stream, not a balance
  };

  let currentExpenses = input.monthlyExpenses;
  let savingsDepletedAge: number | null = null;
  let canSurviveOnPensions = false;

  // Calculate what pensions will provide at 67
  const trAtRetirement = calculateTRPension(input.accounts.occupationalMonthly, 0);
  const totalMonthlyPensionAt67 = input.accounts.occupationalMonthly + trAtRetirement;

  for (let age = input.retirementAge; age <= input.lifeExpectancy; age++) {
    // Apply investment returns to remaining balances
    balances.taxable *= 1 + input.expectedReturns.taxable;
    balances.sereign *= 1 + input.expectedReturns.sereign;

    // Calculate year's withdrawal
    const yearPlan = calculateYearlyWithdrawal(
      age,
      currentExpenses,
      balances,
      input.accounts.occupationalMonthly
    );

    yearlyPlans.push(yearPlan);
    balances = yearPlan.endingBalances;
    totalTaxPaid += yearPlan.totalTaxPaid;
    totalTRReceived += yearPlan.trPensionReceived;

    // Track when savings are depleted
    if (savingsDepletedAge === null && balances.taxable <= 0 && balances.sereign <= 0) {
      savingsDepletedAge = age;
    }

    // Inflate expenses
    currentExpenses *= 1 + input.inflationRate;

    // Check if we can't continue (savings depleted BEFORE pensions available)
    if (
      balances.taxable <= 0 &&
      balances.sereign <= 0 &&
      age < ICELAND_PENSION_AGES.OCCUPATIONAL_STANDARD_AGE
    ) {
      break;
    }
  }

  // Calculate pension coverage at age 67
  // Account for inflation from now to age 67
  const yearsToRetirement = Math.max(0, 67 - input.retirementAge);
  const expensesAt67 = input.monthlyExpenses * Math.pow(1 + input.inflationRate, yearsToRetirement);
  canSurviveOnPensions = totalMonthlyPensionAt67 >= expensesAt67 * 0.8; // 80% coverage considered survivable

  // Generate recommendations
  const recommendations: string[] = [];

  // Check séreign coverage for 60-67 bridge
  const phase2Years = 7; // 60 to 67
  const phase2Expenses = input.monthlyExpenses * 12 * phase2Years;
  if (input.accounts.sereign < phase2Expenses * 0.5) {
    recommendations.push(
      'Íhugaðu að auka séreignarsparnað til að brúa 60-67 ára tímabilið betur'
    );
  }

  // Check TR eligibility
  if (trAtRetirement === 0) {
    recommendations.push(
      'Lífeyrissjóðstekjur þínar eru háar - þú munt ekki fá TR lífeyri'
    );
  } else if (trAtRetirement < TR_MEANS_TEST.MAX_MONTHLY_SINGLE * 0.3) {
    recommendations.push(
      `TR lífeyrir þinn verður skertur í ~${Math.round(trAtRetirement / 1000)}þ kr/mán vegna lífeyrissjóðstekna`
    );
  }

  // Calculate effective portfolio survival
  // If pensions cover expenses after 67, portfolio "survives" to life expectancy
  const portfolioSurvivalYears = yearlyPlans.length;
  const targetYears = input.lifeExpectancy - input.retirementAge;

  if (savingsDepletedAge !== null && savingsDepletedAge < 67) {
    recommendations.push(
      `Sparnaður þinn klárast við ${savingsDepletedAge} ára aldur - þú þarft fleiri fjármuni til að ná 67 ára`
    );
  } else if (savingsDepletedAge !== null && canSurviveOnPensions) {
    // Savings depleted but pensions cover it - this is fine
    recommendations.push(
      `Sparnaður klárast við ${savingsDepletedAge} ára en lífeyrir (${Math.round(totalMonthlyPensionAt67 / 1000)}þ kr/mán) dekkar útgjöld`
    );
  } else if (portfolioSurvivalYears < targetYears && !canSurviveOnPensions) {
    recommendations.push(
      `Safn þitt endist í ${portfolioSurvivalYears} ár - íhugaðu að spara meira eða draga úr útgjöldum`
    );
  }

  return {
    yearlyPlans,
    totalTaxPaid,
    totalTRReceived,
    portfolioSurvivalYears: canSurviveOnPensions ? targetYears : portfolioSurvivalYears,
    optimalSequenceUsed: true,
    recommendations,
  };
}

/**
 * Compare optimal vs suboptimal withdrawal strategies
 */
export function compareWithdrawalStrategies(
  input: WithdrawalSequenceInput
): {
  optimal: WithdrawalSequenceResult;
  suboptimal: WithdrawalSequenceResult;
  taxSavings: number;
  trBenefitGain: number;
} {
  const optimal = generateWithdrawalSequence(input);

  // Suboptimal: Take occupational pension first (common mistake)
  // This would reduce TR benefits
  // For simplicity, estimate the difference
  const trLossFromSuboptimal =
    input.accounts.occupationalMonthly > TR_MEANS_TEST.INCOME_EXEMPTION
      ? (input.accounts.occupationalMonthly - TR_MEANS_TEST.INCOME_EXEMPTION) *
        TR_MEANS_TEST.REDUCTION_RATE *
        12 *
        (input.lifeExpectancy - 67)
      : 0;

  return {
    optimal,
    suboptimal: {
      ...optimal,
      totalTRReceived: optimal.totalTRReceived - trLossFromSuboptimal,
      optimalSequenceUsed: false,
    },
    taxSavings: trLossFromSuboptimal * 0.3, // Rough estimate
    trBenefitGain: trLossFromSuboptimal,
  };
}
