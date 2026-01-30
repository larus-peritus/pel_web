/**
 * TypeScript types for Debt Payoff vs Invest Analyzer
 * Based on "Your Money or Your Life" principles applied to debt decisions
 *
 * This feature helps users decide whether to pay extra on debt or invest the money,
 * considering both mathematical returns and emotional factors (peace of mind).
 */

/**
 * Loan types in Iceland
 */
export type LoanType = 'verdtryggd' | 'oVerdtryggd' | 'other';

/**
 * Payment method for non-indexed loans
 * - 'annuity': Equal payments each month (jafnar afborganir)
 * - 'linear': Equal principal payments, decreasing total (jafnar höfuðstólsgreiðslur)
 */
export type PaymentMethod = 'annuity' | 'linear';

/**
 * Debt payoff strategy for multiple debts
 */
export type PayoffStrategy = 'avalanche' | 'snowball';

/**
 * Investment risk level
 */
export type RiskLevel = 'conservative' | 'moderate' | 'aggressive';

/**
 * Single debt input
 */
export interface DebtInput {
  id: string;
  name?: string; // Optional name for multiple debts
  loanType: LoanType;
  currentBalance: number; // Remaining principal in ISK
  nominalInterestRate: number; // Annual percentage (e.g., 0.08 for 8%)
  inflationRate?: number; // Only for verðtryggð, annual percentage (e.g., 0.03 for 3%)
  minimumPayment: number; // Monthly minimum payment in ISK
  extraPayment: number; // Monthly extra payment available in ISK
  // Optional loan term fields
  originalLoanAmount?: number; // Original loan amount (if known)
  loanTermMonths?: number; // Total loan term in months (optional)
  remainingPayments?: number; // Number of payments remaining (optional)
  paymentMethod?: PaymentMethod; // Payment method for óverðtryggð loans
}

/**
 * Calculated payment breakdown for display
 */
export interface PaymentBreakdown {
  monthlyPayment: number; // Total monthly payment
  principalPayment: number; // Afborgun á höfuðstól
  interestPayment: number; // Vextir mánaðarlega
  inflationAdjustment?: number; // For indexed loans: monthly inflation adjustment
}

/**
 * Investment scenario assumptions
 */
export interface InvestmentAssumptions {
  expectedAnnualReturn: number; // Annual return percentage (e.g., 0.07 for 7%)
  riskLevel: RiskLevel;
}

/**
 * Monthly projection for charting and detailed analysis
 */
export interface MonthlyProjection {
  month: number;
  remainingDebt: number;
  investmentBalance: number;
  netWorth: number;
  interestPaid: number; // Cumulative interest paid to date
  investmentGains: number; // Cumulative investment gains to date
}

/**
 * Detailed amortization schedule row for monthly breakdown
 */
export interface AmortizationRow {
  month: number;
  openingBalance: number;
  payment: number;
  interestPayment: number;
  principalPayment: number;
  closingBalance: number;
  cumulativeInterest: number;
  lifeEnergyHours: number; // payment / actualHourlyWage
}

/**
 * Debt payoff scenario calculation results
 */
export interface DebtPayoffResults {
  // Debt payoff scenario
  debtScenario: {
    monthlyProjections: MonthlyProjection[];
    amortizationSchedule: AmortizationRow[];
    debtFreeMonth: number;
    totalInterestPaid: number;
    totalPrincipalPaid: number;
    lifeEnergyHours: number;
  };

  // Investment scenario
  investmentScenario: {
    monthlyProjections: MonthlyProjection[];
    finalInvestmentBalance: number;
    totalContributions: number;
    totalGains: number;
    finalNetWorth: number; // Investment balance - remaining debt
  };

  // Comparison
  comparison: {
    recommendation: 'debt' | 'invest';
    financialAdvantage: number; // ISK difference
    lifeEnergyAdvantage: number; // Hours difference
    percentageAdvantage: number; // Percentage difference
    breakEvenMonth: number | null;
    reasoning: string[];
    isCloseCall: boolean; // < 5% difference
  };

  // Peace of mind adjustment (if applied)
  peacOfMindAdjustment?: {
    factor: number; // 0-10%
    adjustedRecommendation: 'debt' | 'invest';
    adjustedAdvantage: number;
  };
}

/**
 * Multiple debts analysis results
 */
export interface MultipleDebtsResults {
  avalancheResults: DebtPayoffResults;
  snowballResults: DebtPayoffResults;
  strategyComparison: {
    interestSavings: number; // Avalanche advantage in ISK
    timeSavings: number; // Months saved with avalanche
    emotionalConsideration: string; // Explanation
  };
}

/**
 * Saved debt scenario
 */
export interface DebtPayoffScenario {
  id: string;
  name: string;
  debt: DebtInput;
  investment: InvestmentAssumptions;
  peacOfMindFactor: number;
  results: DebtPayoffResults;
  createdAt: string;
  updatedAt: string;
}

/**
 * Preset loan configurations for Iceland
 */
export interface LoanPreset {
  id: string;
  label: string;
  description: string;
  loanType: LoanType;
  typicalRate: number; // Annual percentage
  typicalInflation?: number; // Annual percentage (for verðtryggð loans)
}

/**
 * Risk level preset configurations
 */
export interface RiskLevelPreset {
  riskLevel: RiskLevel;
  label: string;
  description: string;
  expectedReturn: number; // Annual percentage
  volatilityWarning: string;
}
