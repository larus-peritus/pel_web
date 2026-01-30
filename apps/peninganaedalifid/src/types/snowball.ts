/**
 * TypeScript types for Interest Savings Snowball Calculator
 * (Vaxtasparnaður Snjóboltareiknivél)
 *
 * This calculator helps users understand the compound effect of reinvesting
 * interest savings from extra loan payments, comparing three scenarios:
 * 1. Base case (extra payment only, no snowball)
 * 2. Snowball interest savings to loan
 * 3. Snowball interest savings to investment
 */

/**
 * Loan types in Iceland
 * - 'verdtryggd': Indexed loans that adjust with inflation
 * - 'oVerdtryggd': Non-indexed loans with fixed rates
 */
export type LoanType = 'verdtryggd' | 'oVerdtryggd';

/**
 * Payment method for loans
 * - 'annuity': Equal payments each month (jafnar afborganir)
 * - 'linear': Equal principal payments, decreasing total (jafnar höfuðstólsgreiðslur)
 */
export type PaymentMethod = 'annuity' | 'linear';

/**
 * Input parameters for a single loan in the snowball calculator
 */
export interface SnowballLoanInput {
  /** Original loan amount in ISK (for calculating base payment) */
  originalLoanAmount: number;

  /** Current remaining balance in ISK */
  currentBalance: number;

  /** Annual nominal interest rate (decimal, e.g., 0.09 for 9%) */
  annualInterestRate: number;

  /** Original loan term in months */
  loanTermMonths: number;

  /** Number of payments remaining */
  remainingPayments: number;

  /** Loan type - indexed or non-indexed */
  loanType: LoanType;

  /** Payment method (only applies to óverðtryggð loans) */
  paymentMethod?: PaymentMethod;

  /** Annual inflation rate for verðtryggð loans (decimal, e.g., 0.05 for 5%) */
  inflationRate?: number;
}

/**
 * Complete input for snowball calculator combining loan, extra payment, and investment assumptions
 */
export interface SnowballInput {
  /** Loan details */
  loan: SnowballLoanInput;

  /** Monthly extra payment amount in ISK (beyond minimum payment) */
  extraPayment: number;

  /** Expected annual investment return (decimal, e.g., 0.07 for 7%) */
  expectedInvestmentReturn: number;

  /** User's actual hourly wage for life energy calculations (optional) */
  actualHourlyWage?: number;

  /**
   * Whether to include post-payoff investing in calculations
   * When true: after loan is paid off, the payment amount is invested
   * When false: comparison ends when each scenario pays off
   * Default: true
   */
  includePostPayoffInvesting?: boolean;
}

/**
 * Monthly breakdown row showing all three scenarios side-by-side
 * Provides detailed month-by-month progression for charts and tables
 */
export interface MonthlyRow {
  /** Month number (1-indexed) */
  month: number;

  // === Base Case (extra payment only, no snowball) ===
  /** Opening balance at start of month */
  baseOpeningBalance: number;
  /** Total payment made this month */
  basePayment: number;
  /** Interest charged this month */
  baseInterest: number;
  /** Principal paid down this month */
  basePrincipal: number;
  /** Closing balance at end of month */
  baseClosingBalance: number;

  // === Snowball to Loan (interest savings reinvested in loan) ===
  /** Opening balance at start of month */
  snowballLoanOpeningBalance: number;
  /** Total payment made this month */
  snowballLoanPayment: number;
  /** Accumulated interest savings added as extra payment */
  snowballLoanExtraFromSavings: number;
  /** Interest charged this month */
  snowballLoanInterest: number;
  /** Principal paid down this month */
  snowballLoanPrincipal: number;
  /** Closing balance at end of month */
  snowballLoanClosingBalance: number;

  // === Snowball to Investment (interest savings invested) ===
  /** Opening balance at start of month */
  snowballInvestOpeningBalance: number;
  /** Total payment made this month */
  snowballInvestPayment: number;
  /** Interest charged this month */
  snowballInvestInterest: number;
  /** Principal paid down this month */
  snowballInvestPrincipal: number;
  /** Closing balance at end of month */
  snowballInvestClosingBalance: number;
  /** Investment account balance */
  snowballInvestmentBalance: number;
  /** Interest savings contributed to investment this month */
  snowballInvestmentContribution: number;

  // === Comparison Metrics ===
  /** Interest savings this month compared to base case */
  interestSavingsThisMonth: number;
  /** Cumulative interest savings to date */
  cumulativeInterestSavings: number;
}

/**
 * High-level summary results for a single scenario
 */
export interface ScenarioSummary {
  /** Number of months until debt is fully paid off */
  monthsToPayoff: number;

  /** Total interest paid over the life of the loan */
  totalInterestPaid: number;

  /** Total payments made (principal + interest) */
  totalPayments: number;

  /** Final investment balance (0 for base and snowball-to-loan scenarios) */
  finalInvestmentBalance: number;

  /** Total wealth created (debt eliminated + investment value) */
  totalWealthCreated: number;

  /** Life energy metrics if actualHourlyWage provided */
  lifeEnergyHours: {
    /** Total interest paid in life energy hours */
    totalInterest: number;
    /** Total payments made in life energy hours */
    totalPayments: number;
    /** Investment gains in life energy hours */
    investmentGains: number;
    /** Net benefit in life energy hours (wealth - interest) */
    netBenefit: number;
  };
}

/**
 * Complete results from snowball calculator including all scenarios and recommendation
 */
export interface SnowballResults {
  /** Detailed monthly breakdown for all scenarios */
  monthlySchedule: MonthlyRow[];

  /** Scenario 1: Base case with extra payment only */
  baseCase: ScenarioSummary;

  /** Scenario 2: Snowball interest savings back to loan */
  snowballToLoan: ScenarioSummary;

  /** Scenario 3: Snowball interest savings to investment */
  snowballToInvestment: ScenarioSummary;

  /** AI-style recommendation with reasoning */
  recommendation: {
    /** Best scenario based on total wealth created */
    bestScenario: 'base' | 'snowballLoan' | 'snowballInvest';
    /** True if scenarios are within 5% of each other (close call) */
    isCloseCall: boolean;
    /** Plain-language Icelandic explanation of the recommendation */
    reasoning: string;
    /** Life energy difference in hours between best and worst scenario */
    lifeEnergyDifference: number;
  };
}
