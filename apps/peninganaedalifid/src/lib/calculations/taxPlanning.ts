/**
 * Iceland Tax Planning Calculations
 *
 * Helps users understand after-tax retirement income in Iceland.
 * Includes income tax, capital gains tax, and personal tax credit.
 */

/**
 * Iceland income tax brackets (2024)
 * Note: Thresholds are ANNUAL values for calculation purposes
 * Monthly equivalents: Þrep 1: 0-446,136, Þrep 2: 446,136-1,252,501, Þrep 3: >1,252,501
 */
export const ICELAND_TAX_BRACKETS = {
  BRACKET_1: {
    threshold: 0,
    thresholdMonthly: 0,
    rate: 0.3145,
    label: 'Þrep 1',
  },
  BRACKET_2: {
    threshold: 446136 * 12, // 5,353,632 kr/ár
    thresholdMonthly: 446136,
    rate: 0.3795,
    label: 'Þrep 2',
  },
  BRACKET_3: {
    threshold: 1252501 * 12, // 15,030,012 kr/ár
    thresholdMonthly: 1252501,
    rate: 0.4645,
    label: 'Þrep 3',
  },
};

/**
 * Tax constants
 */
export const ICELAND_TAX_CONSTANTS = {
  // Personal tax credit (persónuafsláttur) - monthly
  PERSONAL_TAX_CREDIT_MONTHLY: 64926,
  // Capital gains tax rate
  CAPITAL_GAINS_TAX_RATE: 0.22,
  // First ISK of capital gains exempt (if total income low)
  CAPITAL_GAINS_EXEMPTION: 0, // Currently no exemption
  // Pension contribution deduction limit
  PENSION_CONTRIBUTION_LIMIT: 0.04, // 4% of salary deductible
  // Séreign contribution deduction limit
  SEREIGN_DEDUCTION_LIMIT: 0.04, // 4% of salary
};

/**
 * Income type for tax calculation
 */
export type IncomeType = 'salary' | 'pension' | 'sereign' | 'capital_gains' | 'rental' | 'other';

/**
 * Income source with type and amount
 */
export interface IncomeSource {
  type: IncomeType;
  monthlyAmount: number;
  label?: string;
}

/**
 * Tax calculation result
 */
export interface TaxCalculationResult {
  grossIncome: number;
  taxableIncome: number;
  incomeTax: number;
  capitalGainsTax: number;
  totalTax: number;
  personalTaxCredit: number;
  effectiveTaxRate: number;
  netIncome: number;
  taxByBracket: {
    bracket: string;
    taxableAmount: number;
    rate: number;
    tax: number;
  }[];
}

/**
 * Calculate income tax with brackets
 */
export function calculateIncomeTax(
  annualTaxableIncome: number
): { totalTax: number; byBracket: TaxCalculationResult['taxByBracket'] } {
  const brackets = [
    ICELAND_TAX_BRACKETS.BRACKET_1,
    ICELAND_TAX_BRACKETS.BRACKET_2,
    ICELAND_TAX_BRACKETS.BRACKET_3,
  ];

  let remainingIncome = annualTaxableIncome;
  let totalTax = 0;
  const byBracket: TaxCalculationResult['taxByBracket'] = [];

  for (let i = brackets.length - 1; i >= 0; i--) {
    const bracket = brackets[i];
    if (remainingIncome > bracket.threshold) {
      const taxableInBracket = remainingIncome - bracket.threshold;
      const taxInBracket = taxableInBracket * bracket.rate;

      byBracket.unshift({
        bracket: bracket.label,
        taxableAmount: taxableInBracket,
        rate: bracket.rate,
        tax: taxInBracket,
      });

      totalTax += taxInBracket;
      remainingIncome = bracket.threshold;
    }
  }

  return { totalTax, byBracket };
}

/**
 * Calculate capital gains tax
 */
export function calculateCapitalGainsTax(capitalGains: number): number {
  return capitalGains * ICELAND_TAX_CONSTANTS.CAPITAL_GAINS_TAX_RATE;
}

/**
 * Calculate total tax for retirement income
 */
export function calculateRetirementTax(
  incomeSources: IncomeSource[]
): TaxCalculationResult {
  // Separate capital gains from other income
  const capitalGainsIncome = incomeSources
    .filter((s) => s.type === 'capital_gains')
    .reduce((sum, s) => sum + s.monthlyAmount * 12, 0);

  const regularIncome = incomeSources
    .filter((s) => s.type !== 'capital_gains')
    .reduce((sum, s) => sum + s.monthlyAmount * 12, 0);

  const grossIncome = regularIncome + capitalGainsIncome;

  // Calculate income tax on regular income
  const { totalTax: incomeTax, byBracket } = calculateIncomeTax(regularIncome);

  // Calculate capital gains tax
  const capitalGainsTax = calculateCapitalGainsTax(capitalGainsIncome);

  // Apply personal tax credit
  const annualTaxCredit = ICELAND_TAX_CONSTANTS.PERSONAL_TAX_CREDIT_MONTHLY * 12;
  const taxAfterCredit = Math.max(0, incomeTax - annualTaxCredit);

  // Total tax (capital gains not offset by personal credit)
  const totalTax = taxAfterCredit + capitalGainsTax;

  // Net income
  const netIncome = grossIncome - totalTax;

  // Effective tax rate
  const effectiveTaxRate = grossIncome > 0 ? totalTax / grossIncome : 0;

  return {
    grossIncome,
    taxableIncome: regularIncome,
    incomeTax: taxAfterCredit,
    capitalGainsTax,
    totalTax,
    personalTaxCredit: Math.min(annualTaxCredit, incomeTax),
    effectiveTaxRate,
    netIncome,
    taxByBracket: byBracket,
  };
}

/**
 * Compare tax efficiency of different withdrawal strategies
 */
export interface TaxStrategyComparison {
  strategy: string;
  description: string;
  taxResult: TaxCalculationResult;
  annualTaxSavings: number;
}

export function compareTaxStrategies(
  occupationalPension: number,
  sereignWithdrawal: number,
  taxableWithdrawal: number,
  monthlyExpenses: number
): TaxStrategyComparison[] {
  const strategies: TaxStrategyComparison[] = [];

  // Strategy 1: All from occupational pension
  const allPension: IncomeSource[] = [
    { type: 'pension', monthlyAmount: monthlyExpenses, label: 'Lífeyrissjóður' },
  ];
  const allPensionTax = calculateRetirementTax(allPension);

  // Strategy 2: Mix of pension and séreign
  const mixedIncome: IncomeSource[] = [
    { type: 'pension', monthlyAmount: monthlyExpenses * 0.5, label: 'Lífeyrissjóður' },
    { type: 'sereign', monthlyAmount: monthlyExpenses * 0.5, label: 'Séreign' },
  ];
  const mixedTax = calculateRetirementTax(mixedIncome);

  // Strategy 3: Maximize capital gains (taxed at 22%)
  const capitalGainsHeavy: IncomeSource[] = [
    { type: 'pension', monthlyAmount: monthlyExpenses * 0.3, label: 'Lífeyrissjóður' },
    { type: 'capital_gains', monthlyAmount: monthlyExpenses * 0.7, label: 'Fjármagnstekjur' },
  ];
  const capitalGainsTax = calculateRetirementTax(capitalGainsHeavy);

  // Strategy 4: Low income to maximize TR
  const lowIncome: IncomeSource[] = [
    { type: 'pension', monthlyAmount: 200000, label: 'Lífeyrissjóður (lágmarks)' },
    { type: 'capital_gains', monthlyAmount: monthlyExpenses - 200000, label: 'Fjármagnstekjur' },
  ];
  const lowIncomeTax = calculateRetirementTax(lowIncome);

  // Find minimum tax strategy
  const minTax = Math.min(
    allPensionTax.totalTax,
    mixedTax.totalTax,
    capitalGainsTax.totalTax,
    lowIncomeTax.totalTax
  );

  strategies.push({
    strategy: 'Allt úr lífeyrissjóði',
    description: 'Tekjuskattað sem launatekjur (31-46%)',
    taxResult: allPensionTax,
    annualTaxSavings: allPensionTax.totalTax - minTax,
  });

  strategies.push({
    strategy: 'Blönduð úttekt',
    description: '50% lífeyrissjóður + 50% séreign',
    taxResult: mixedTax,
    annualTaxSavings: mixedTax.totalTax - minTax,
  });

  strategies.push({
    strategy: 'Fjármagnstekjur',
    description: '30% lífeyrissjóður + 70% fjármagnstekjur (22%)',
    taxResult: capitalGainsTax,
    annualTaxSavings: capitalGainsTax.totalTax - minTax,
  });

  strategies.push({
    strategy: 'Lágar lífeyristekjur',
    description: 'Lágmarks lífeyrissjóður til að hámarka TR',
    taxResult: lowIncomeTax,
    annualTaxSavings: lowIncomeTax.totalTax - minTax,
  });

  return strategies;
}

/**
 * Calculate optimal income level to maximize personal tax credit
 */
export function calculateOptimalIncomeForCredit(): {
  optimalMonthlyIncome: number;
  reason: string;
} {
  // The personal tax credit fully offsets tax at the lowest bracket up to a point
  const annualCredit = ICELAND_TAX_CONSTANTS.PERSONAL_TAX_CREDIT_MONTHLY * 12;
  const lowestRate = ICELAND_TAX_BRACKETS.BRACKET_1.rate;

  // Income where tax = credit
  const optimalAnnualIncome = annualCredit / lowestRate;
  const optimalMonthlyIncome = optimalAnnualIncome / 12;

  return {
    optimalMonthlyIncome: Math.round(optimalMonthlyIncome),
    reason: `Við ~${Math.round(optimalMonthlyIncome / 1000)}k kr/mán, greiðir þú núll tekjuskatt vegna persónuafsláttar`,
  };
}

/**
 * Calculate after-tax value of different account types
 */
export function calculateAfterTaxValue(
  amount: number,
  accountType: 'taxable' | 'sereign' | 'occupational'
): {
  grossAmount: number;
  estimatedTax: number;
  netAmount: number;
  effectiveRate: number;
} {
  let estimatedTax = 0;

  if (accountType === 'taxable') {
    // Capital gains tax on estimated gains (assume 50% is gains)
    estimatedTax = amount * 0.5 * ICELAND_TAX_CONSTANTS.CAPITAL_GAINS_TAX_RATE;
  } else if (accountType === 'sereign' || accountType === 'occupational') {
    // Taxed as income - estimate at middle bracket
    const middleRate = ICELAND_TAX_BRACKETS.BRACKET_2.rate;
    // After personal tax credit (rough estimate)
    const creditOffset = ICELAND_TAX_CONSTANTS.PERSONAL_TAX_CREDIT_MONTHLY * 12;
    const taxableAfterCredit = Math.max(0, amount - creditOffset / middleRate);
    estimatedTax = taxableAfterCredit * middleRate;
  }

  return {
    grossAmount: amount,
    estimatedTax,
    netAmount: amount - estimatedTax,
    effectiveRate: amount > 0 ? estimatedTax / amount : 0,
  };
}
