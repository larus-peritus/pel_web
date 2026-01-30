/**
 * Inflation Stress Testing Calculations
 *
 * Shows impact of various inflation scenarios on retirement portfolio.
 * Iceland-specific: Higher historical inflation than US/EU.
 */

/**
 * Inflation scenario
 */
export interface InflationScenario {
  name: string;
  rate: number;
  description: string;
  color: string;
}

/**
 * Standard Iceland inflation scenarios
 */
export const ICELAND_INFLATION_SCENARIOS: InflationScenario[] = [
  {
    name: 'Lág verðbólga',
    rate: 0.025,
    description: 'Seðlabankamarkmið náð (2.5%)',
    color: 'green',
  },
  {
    name: 'Meðalverðbólga',
    rate: 0.04,
    description: 'Söguleg meðaltal Íslands (4%)',
    color: 'yellow',
  },
  {
    name: 'Há verðbólga',
    rate: 0.06,
    description: 'Erfiðari tímar (6%)',
    color: 'orange',
  },
  {
    name: 'Verðbólgukreppa',
    rate: 0.10,
    description: 'Alvarleg verðbólga (10%)',
    color: 'red',
  },
];

/**
 * Historical Iceland inflation data (annual) from 1998
 * Source: Hagstofa Íslands (Statistics Iceland)
 */
export const ICELAND_HISTORICAL_INFLATION: { year: number; rate: number }[] = [
  { year: 1998, rate: 0.017 },
  { year: 1999, rate: 0.032 },
  { year: 2000, rate: 0.051 },
  { year: 2001, rate: 0.067 },
  { year: 2002, rate: 0.048 },
  { year: 2003, rate: 0.021 },
  { year: 2004, rate: 0.032 },
  { year: 2005, rate: 0.040 },
  { year: 2006, rate: 0.068 },
  { year: 2007, rate: 0.051 },
  { year: 2008, rate: 0.127 }, // Financial crisis
  { year: 2009, rate: 0.120 }, // Post-crisis
  { year: 2010, rate: 0.054 },
  { year: 2011, rate: 0.040 },
  { year: 2012, rate: 0.052 },
  { year: 2013, rate: 0.039 },
  { year: 2014, rate: 0.020 },
  { year: 2015, rate: 0.016 },
  { year: 2016, rate: 0.017 },
  { year: 2017, rate: 0.018 },
  { year: 2018, rate: 0.027 },
  { year: 2019, rate: 0.030 },
  { year: 2020, rate: 0.028 },
  { year: 2021, rate: 0.044 },
  { year: 2022, rate: 0.083 },
  { year: 2023, rate: 0.087 },
  { year: 2024, rate: 0.055 },
];

/**
 * Portfolio survival result
 */
export interface PortfolioSurvivalResult {
  scenario: InflationScenario;
  yearsLasted: number;
  finalBalance: number;
  yearlyData: {
    year: number;
    age: number;
    startBalance: number;
    withdrawal: number;
    return: number;
    endBalance: number;
    realPurchasingPower: number;
  }[];
  survivalProbability: number;
  inflationAdjustedWithdrawal: number[];
}

/**
 * Input for inflation stress test
 */
export interface InflationStressInput {
  initialPortfolio: number;
  annualExpenses: number;
  currentAge: number;
  retirementAge: number;
  targetYears: number;
  expectedReturn: number;
}

/**
 * Calculate portfolio survival under different inflation scenarios
 */
export function calculatePortfolioSurvival(
  input: InflationStressInput,
  scenario: InflationScenario
): PortfolioSurvivalResult {
  const yearlyData: PortfolioSurvivalResult['yearlyData'] = [];
  let balance = input.initialPortfolio;
  let currentExpenses = input.annualExpenses;
  let year = 0;
  const inflationAdjustedWithdrawal: number[] = [];

  // Real return = nominal return - inflation
  const realReturn = input.expectedReturn - scenario.rate;

  while (balance > 0 && year < input.targetYears + 10) {
    const age = input.retirementAge + year;
    const startBalance = balance;

    // Withdrawal (inflation-adjusted expenses)
    const withdrawal = Math.min(currentExpenses, balance);
    inflationAdjustedWithdrawal.push(withdrawal);
    balance -= withdrawal;

    // Investment return on remaining balance
    const returnAmount = balance * input.expectedReturn;
    balance += returnAmount;

    // Calculate real purchasing power
    const inflationFactor = Math.pow(1 + scenario.rate, year);
    const realPurchasingPower = balance / inflationFactor;

    yearlyData.push({
      year: year + 1,
      age,
      startBalance,
      withdrawal,
      return: returnAmount,
      endBalance: balance,
      realPurchasingPower,
    });

    // Inflate expenses for next year
    currentExpenses *= 1 + scenario.rate;
    year++;

    if (balance <= 0) break;
  }

  // Calculate survival probability (simplified Monte Carlo approximation)
  const yearsLasted = yearlyData.length;
  const survivalProbability = Math.min(
    100,
    (yearsLasted / input.targetYears) * 100 * (realReturn > 0 ? 1 : 0.5)
  );

  return {
    scenario,
    yearsLasted,
    finalBalance: balance,
    yearlyData,
    survivalProbability,
    inflationAdjustedWithdrawal,
  };
}

/**
 * Run stress test across all scenarios
 */
export function runInflationStressTest(
  input: InflationStressInput
): PortfolioSurvivalResult[] {
  return ICELAND_INFLATION_SCENARIOS.map((scenario) =>
    calculatePortfolioSurvival(input, scenario)
  );
}

/**
 * Calculate safe withdrawal rate for a given survival probability
 */
export function calculateSafeWithdrawalRate(
  portfolioValue: number,
  inflationRate: number,
  expectedReturn: number,
  targetYears: number,
  targetSurvivalRate: number = 0.95
): number {
  // Use present value of annuity formula adjusted for real return
  const realReturn = expectedReturn - inflationRate;

  if (realReturn <= 0) {
    // If real return is negative, simple division
    return portfolioValue / targetYears / portfolioValue;
  }

  // Present Value of Growing Annuity formula
  const pvFactor =
    (1 - Math.pow((1 + inflationRate) / (1 + expectedReturn), targetYears)) /
    (realReturn);

  const safeWithdrawal = portfolioValue / pvFactor;
  const safeRate = safeWithdrawal / portfolioValue;

  // Apply safety margin for survival probability
  const safetyMargin = 1 - (1 - targetSurvivalRate) * 2;

  return Math.max(0.02, Math.min(0.05, safeRate * safetyMargin));
}

/**
 * Get recommended multiplier based on inflation scenario
 */
export function getRecommendedMultiplier(inflationRate: number): {
  multiplier: number;
  withdrawalRate: number;
  description: string;
} {
  if (inflationRate <= 0.025) {
    return {
      multiplier: 25,
      withdrawalRate: 0.04,
      description: 'Hefðbundin 4% regla gæti virkað með lágri verðbólgu',
    };
  } else if (inflationRate <= 0.04) {
    return {
      multiplier: 30,
      withdrawalRate: 0.0333,
      description: 'Mælt með 30x margfaldara fyrir íslenskar aðstæður',
    };
  } else if (inflationRate <= 0.06) {
    return {
      multiplier: 33,
      withdrawalRate: 0.03,
      description: 'Íhaldssöm 3% regla nauðsynleg við hærri verðbólgu',
    };
  } else {
    return {
      multiplier: 40,
      withdrawalRate: 0.025,
      description: 'Mjög íhaldssöm nálgun nauðsynleg við mikla verðbólgu',
    };
  }
}

/**
 * Calculate inflation-indexed bond allocation suggestion
 */
export function suggestInflationProtection(
  currentAge: number,
  riskTolerance: 'low' | 'medium' | 'high'
): {
  inflationIndexedBonds: number;
  nominalBonds: number;
  stocks: number;
  rationale: string;
} {
  // Base allocation on age (classic formula: 100 - age = stock %)
  const baseStockPercent = Math.max(20, Math.min(80, 100 - currentAge));

  // Adjust for risk tolerance
  const riskAdjustment =
    riskTolerance === 'low' ? -10 : riskTolerance === 'high' ? 10 : 0;

  const stocks = Math.max(20, Math.min(80, baseStockPercent + riskAdjustment));
  const bonds = 100 - stocks;

  // For Iceland, suggest more inflation-indexed bonds
  const inflationIndexedBonds = Math.round(bonds * 0.6);
  const nominalBonds = bonds - inflationIndexedBonds;

  return {
    inflationIndexedBonds,
    nominalBonds,
    stocks,
    rationale: `Við ${currentAge} ára aldur og ${
      riskTolerance === 'low' ? 'lágt' : riskTolerance === 'high' ? 'hátt' : 'meðal'
    } áhættuþol, mælum við með ${stocks}% hlutabréfum og ${bonds}% skuldabréfum. Vegna íslenskrar verðbólgusögu, ætti ${inflationIndexedBonds}% að vera í verðtryggðum skuldabréfum.`,
  };
}
