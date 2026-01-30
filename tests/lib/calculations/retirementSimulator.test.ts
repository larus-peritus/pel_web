/**
 * Unit tests for Retirement Date Simulator calculations
 *
 * Tests withdrawal strategies, pension income, and helper functions.
 */

import { describe, it, expect } from 'vitest';
import {
  calculateWithdrawal4Percent,
  calculateWithdrawalVariable,
  calculateWithdrawalGuardrails,
  calculatePensionIncome,
  calculateYearlyExpenses,
  calculatePortfolioReturn,
  calculateFutureValue,
  calculateYearsToRetirement,
  calculateWithdrawal,
  estimateTypicalPension,
  calculateTotalPensionIncome,
  prepareSimulationConfig,
} from '@/lib/calculations/retirementSimulator';

import type {
  IcelandicPensionInput,
  RetirementSimulation,
  WithdrawalStrategy,
  PensionSchedule,
} from '@/types/retirementSimulator';

import {
  ICELANDIC_PENSION_DEFAULTS,
  DEFAULT_INFLATION_RATE,
  DEFAULT_EXPECTED_RETURN,
  DEFAULT_RETURN_VOLATILITY,
  DEFAULT_LIFE_EXPECTANCY,
} from '@/lib/constants/retirementSimulator';

describe('calculateWithdrawal4Percent', () => {
  it('should calculate correct withdrawal in first year', () => {
    const portfolio = 10_000_000; // 10M ISK
    const baseWithdrawal = portfolio * 0.04; // 400k ISK/year
    const year = 0;
    const inflationRate = 0.03;

    const monthlyWithdrawal = calculateWithdrawal4Percent(
      portfolio,
      baseWithdrawal,
      year,
      inflationRate,
    );

    // First year: 400k / 12 = 33,333.33 ISK/month
    expect(monthlyWithdrawal).toBeCloseTo(33_333.33, 2);
  });

  it('should apply inflation adjustment in subsequent years', () => {
    const portfolio = 10_000_000;
    const baseWithdrawal = portfolio * 0.04; // 400k ISK/year
    const year = 5;
    const inflationRate = 0.03;

    const monthlyWithdrawal = calculateWithdrawal4Percent(
      portfolio,
      baseWithdrawal,
      year,
      inflationRate,
    );

    // After 5 years at 3% inflation: 400k * 1.03^5 / 12
    const expectedAnnual = baseWithdrawal * Math.pow(1.03, 5);
    const expectedMonthly = expectedAnnual / 12;

    expect(monthlyWithdrawal).toBeCloseTo(expectedMonthly, 2);
  });

  it('should handle zero inflation rate', () => {
    const portfolio = 10_000_000;
    const baseWithdrawal = portfolio * 0.04;
    const year = 10;
    const inflationRate = 0;

    const monthlyWithdrawal = calculateWithdrawal4Percent(
      portfolio,
      baseWithdrawal,
      year,
      inflationRate,
    );

    // No inflation: withdrawal stays constant
    expect(monthlyWithdrawal).toBeCloseTo(33_333.33, 2);
  });
});

describe('calculateWithdrawalVariable', () => {
  it('should withdraw correct percentage of current portfolio', () => {
    const portfolio = 10_000_000;
    const rate = 0.04;

    const monthlyWithdrawal = calculateWithdrawalVariable(portfolio, rate);

    // 4% of 10M = 400k/year = 33,333.33/month
    expect(monthlyWithdrawal).toBeCloseTo(33_333.33, 2);
  });

  it('should scale with portfolio changes', () => {
    const rate = 0.04;

    const withdrawal1 = calculateWithdrawalVariable(10_000_000, rate);
    const withdrawal2 = calculateWithdrawalVariable(5_000_000, rate);

    // Half the portfolio = half the withdrawal
    expect(withdrawal2).toBeCloseTo(withdrawal1 / 2, 2);
  });

  it('should handle different withdrawal rates', () => {
    const portfolio = 10_000_000;

    const withdrawal3Percent = calculateWithdrawalVariable(portfolio, 0.03);
    const withdrawal5Percent = calculateWithdrawalVariable(portfolio, 0.05);

    // 3% withdrawal
    expect(withdrawal3Percent).toBeCloseTo(25_000, 2);
    // 5% withdrawal
    expect(withdrawal5Percent).toBeCloseTo(41_666.67, 2);
  });
});

describe('calculateWithdrawalGuardrails', () => {
  it('should maintain base withdrawal between guardrails', () => {
    const portfolio = 10_000_000;
    const baseWithdrawal = 400_000; // 400k/year
    const upperGuard = 1.3; // 130%
    const lowerGuard = 0.8; // 80%
    const adjustment = 0.1; // 10%

    const monthlyWithdrawal = calculateWithdrawalGuardrails(
      portfolio,
      baseWithdrawal,
      upperGuard,
      lowerGuard,
      adjustment,
    );

    // Within guardrails: base withdrawal
    expect(monthlyWithdrawal).toBeCloseTo(baseWithdrawal / 12, 2);
  });

  it('should increase withdrawal above upper guardrail', () => {
    const portfolio = 15_000_000; // Significantly above initial
    const baseWithdrawal = 400_000;
    const upperGuard = 1.3;
    const lowerGuard = 0.8;
    const adjustment = 0.1;

    const monthlyWithdrawal = calculateWithdrawalGuardrails(
      portfolio,
      baseWithdrawal,
      upperGuard,
      lowerGuard,
      adjustment,
    );

    // Above upper guardrail: increase by 10%
    const expectedAnnual = baseWithdrawal * 1.1;
    expect(monthlyWithdrawal).toBeCloseTo(expectedAnnual / 12, 2);
  });

  it('should decrease withdrawal below lower guardrail', () => {
    const portfolio = 5_000_000; // Significantly below initial
    const baseWithdrawal = 400_000;
    const upperGuard = 1.3;
    const lowerGuard = 0.8;
    const adjustment = 0.1;

    const monthlyWithdrawal = calculateWithdrawalGuardrails(
      portfolio,
      baseWithdrawal,
      upperGuard,
      lowerGuard,
      adjustment,
    );

    // Below lower guardrail: decrease by 10%
    const expectedAnnual = baseWithdrawal * 0.9;
    expect(monthlyWithdrawal).toBeCloseTo(expectedAnnual / 12, 2);
  });
});

describe('calculatePensionIncome', () => {
  it('should return zero when pensions are disabled', () => {
    const age = 70;
    const pensions: IcelandicPensionInput = {
      lifeyrissjodur: {
        enabled: false,
        startAge: 60,
        monthlyAmount: 150_000,
        inflationAdjusted: true,
      },
      sereign: {
        enabled: false,
        startAge: 60,
        monthlyAmount: 100_000,
        inflationAdjusted: true,
      },
      ellilifeyrir: {
        enabled: false,
        startAge: 67,
        monthlyAmount: 200_000,
        inflationAdjusted: true,
      },
    };

    const income = calculatePensionIncome(age, pensions);

    expect(income).toBe(0);
  });

  it('should return lífeyrissjóður income when age >= 60', () => {
    const age = 65;
    const pensions: IcelandicPensionInput = {
      lifeyrissjodur: {
        enabled: true,
        startAge: 60,
        monthlyAmount: 150_000,
        inflationAdjusted: true,
      },
      sereign: {
        enabled: false,
        startAge: 60,
        monthlyAmount: 100_000,
        inflationAdjusted: true,
      },
      ellilifeyrir: {
        enabled: false,
        startAge: 67,
        monthlyAmount: 200_000,
        inflationAdjusted: true,
      },
    };

    const income = calculatePensionIncome(age, pensions);

    expect(income).toBe(150_000);
  });

  it('should return both pensions when age >= 67', () => {
    const age = 70;
    const pensions: IcelandicPensionInput = {
      lifeyrissjodur: {
        enabled: true,
        startAge: 60,
        monthlyAmount: 150_000,
        inflationAdjusted: true,
      },
      sereign: {
        enabled: false,
        startAge: 60,
        monthlyAmount: 100_000,
        inflationAdjusted: true,
      },
      ellilifeyrir: {
        enabled: true,
        startAge: 67,
        monthlyAmount: 200_000,
        inflationAdjusted: true,
      },
    };

    const income = calculatePensionIncome(age, pensions);

    // 150k + 200k = 350k ISK/month (sereign disabled)
    expect(income).toBe(350_000);
  });

  it('should not return pension income before start age', () => {
    const age = 59;
    const pensions: IcelandicPensionInput = {
      lifeyrissjodur: {
        enabled: true,
        startAge: 60,
        monthlyAmount: 150_000,
        inflationAdjusted: true,
      },
      sereign: {
        enabled: true,
        startAge: 60,
        monthlyAmount: 100_000,
        inflationAdjusted: true,
      },
      ellilifeyrir: {
        enabled: true,
        startAge: 67,
        monthlyAmount: 200_000,
        inflationAdjusted: true,
      },
    };

    const income = calculatePensionIncome(age, pensions);

    expect(income).toBe(0);
  });
});

describe('calculateYearlyExpenses', () => {
  it('should return net expenses after pension income', () => {
    const expenses = 400_000;
    const age = 70;
    const pensionIncome = 150_000;

    const netExpenses = calculateYearlyExpenses(expenses, age, pensionIncome);

    // 400k - 150k = 250k
    expect(netExpenses).toBe(250_000);
  });

  it('should not return negative expenses', () => {
    const expenses = 200_000;
    const age = 70;
    const pensionIncome = 300_000; // More than expenses

    const netExpenses = calculateYearlyExpenses(expenses, age, pensionIncome);

    // Pension surplus doesn't create negative expenses
    expect(netExpenses).toBe(0);
  });

  it('should return full expenses when no pension', () => {
    const expenses = 400_000;
    const age = 55;
    const pensionIncome = 0;

    const netExpenses = calculateYearlyExpenses(expenses, age, pensionIncome);

    expect(netExpenses).toBe(expenses);
  });
});

describe('calculatePortfolioReturn', () => {
  it('should calculate correct return for portfolio', () => {
    const portfolio = 10_000_000;
    const expectedReturn = 0.07; // 7%
    const volatility = 0.18;

    const newPortfolio = calculatePortfolioReturn(portfolio, expectedReturn, volatility);

    // 10M * 1.07 = 10.7M
    expect(newPortfolio).toBeCloseTo(10_700_000, 2);
  });

  it('should handle zero return', () => {
    const portfolio = 10_000_000;
    const expectedReturn = 0;
    const volatility = 0;

    const newPortfolio = calculatePortfolioReturn(portfolio, expectedReturn, volatility);

    expect(newPortfolio).toBe(portfolio);
  });

  it('should handle negative return', () => {
    const portfolio = 10_000_000;
    const expectedReturn = -0.1; // -10%
    const volatility = 0.18;

    const newPortfolio = calculatePortfolioReturn(portfolio, expectedReturn, volatility);

    // 10M * 0.9 = 9M
    expect(newPortfolio).toBeCloseTo(9_000_000, 2);
  });
});

describe('calculateFutureValue', () => {
  it('should calculate correct compound growth', () => {
    const principal = 1_000_000;
    const rate = 0.07;
    const years = 10;

    const futureValue = calculateFutureValue(principal, rate, years);

    // 1M * 1.07^10 = 1,967,151.36
    expect(futureValue).toBeCloseTo(1_967_151.36, 2);
  });

  it('should return principal when years is zero', () => {
    const principal = 1_000_000;
    const rate = 0.07;
    const years = 0;

    const futureValue = calculateFutureValue(principal, rate, years);

    expect(futureValue).toBe(principal);
  });

  it('should handle zero growth rate', () => {
    const principal = 1_000_000;
    const rate = 0;
    const years = 10;

    const futureValue = calculateFutureValue(principal, rate, years);

    expect(futureValue).toBe(principal);
  });
});

describe('calculateYearsToRetirement', () => {
  it('should calculate correct years', () => {
    const currentAge = 35;
    const targetAge = 60;

    const years = calculateYearsToRetirement(currentAge, targetAge);

    expect(years).toBe(25);
  });

  it('should return zero when already at retirement age', () => {
    const currentAge = 65;
    const targetAge = 65;

    const years = calculateYearsToRetirement(currentAge, targetAge);

    expect(years).toBe(0);
  });

  it('should return zero when past retirement age', () => {
    const currentAge = 70;
    const targetAge = 65;

    const years = calculateYearsToRetirement(currentAge, targetAge);

    expect(years).toBe(0);
  });
});

describe('calculateWithdrawal', () => {
  it('should dispatch to 4% rule correctly', () => {
    const strategy: WithdrawalStrategy = {
      type: '4percent',
      rate: 0.04,
      inflationAdjusted: true,
    };

    const withdrawal = calculateWithdrawal(strategy, 10_000_000, 10_000_000, 0, 0.03);

    // 4% of 10M = 400k/year = 33,333.33/month
    expect(withdrawal).toBeCloseTo(33_333.33, 2);
  });

  it('should dispatch to variable spending correctly', () => {
    const strategy: WithdrawalStrategy = {
      type: 'variable',
      percentageOfPortfolio: 0.04,
    };

    const withdrawal = calculateWithdrawal(strategy, 8_000_000, 10_000_000, 5, 0.03);

    // 4% of current 8M = 320k/year = 26,666.67/month
    expect(withdrawal).toBeCloseTo(26_666.67, 2);
  });

  it('should dispatch to guardrails correctly', () => {
    const strategy: WithdrawalStrategy = {
      type: 'guardrails',
      baseWithdrawal: 400_000,
      upperGuardrail: 1.3,
      lowerGuardrail: 0.8,
      adjustmentPercent: 0.1,
    };

    const withdrawal = calculateWithdrawal(strategy, 10_000_000, 10_000_000, 0, 0.03);

    // Within guardrails: base withdrawal
    expect(withdrawal).toBeCloseTo(400_000 / 12, 2);
  });

  it('should dispatch to custom withdrawal correctly', () => {
    const strategy: WithdrawalStrategy = {
      type: 'custom',
      yearlyWithdrawals: [500_000, 450_000, 400_000],
    };

    const withdrawal = calculateWithdrawal(strategy, 10_000_000, 10_000_000, 1, 0.03);

    // Year 1: 450k/year = 37,500/month
    expect(withdrawal).toBeCloseTo(37_500, 2);
  });

  it('should handle unknown strategy type with default', () => {
    // Testing invalid strategy type (TypeScript won't allow this normally)
    const strategy = {
      type: 'unknown',
    } as unknown as WithdrawalStrategy;

    const withdrawal = calculateWithdrawal(strategy, 10_000_000, 10_000_000, 0, 0.03);

    // Falls back to 4% rule
    expect(withdrawal).toBeCloseTo(33_333.33, 2);
  });
});

describe('estimateTypicalPension', () => {
  it('should return lífeyrissjóður estimate at age 60+', () => {
    const age = 65;
    const estimate = estimateTypicalPension(age, 'lifeyrissjodur');

    expect(estimate).toBe(ICELANDIC_PENSION_DEFAULTS.TYPICAL_LIFEYRISSJODUR_MONTHLY);
  });

  it('should return ellilífeyrir estimate at age 67+', () => {
    const age = 70;
    const estimate = estimateTypicalPension(age, 'ellilifeyrir');

    expect(estimate).toBe(ICELANDIC_PENSION_DEFAULTS.TYPICAL_ELLILIFEYRIR_MONTHLY);
  });

  it('should return zero for lífeyrissjóður before age 60', () => {
    const age = 59;
    const estimate = estimateTypicalPension(age, 'lifeyrissjodur');

    expect(estimate).toBe(0);
  });

  it('should return zero for ellilífeyrir before age 67', () => {
    const age = 66;
    const estimate = estimateTypicalPension(age, 'ellilifeyrir');

    expect(estimate).toBe(0);
  });
});

describe('calculateTotalPensionIncome', () => {
  it('should calculate total from multiple pensions', () => {
    const age = 70;
    const pensions: PensionSchedule[] = [
      {
        startAge: 60,
        monthlyAmount: 150_000,
        inflationAdjusted: false,
        inflationRate: 0.03,
        type: 'lifeyrissjodur',
      },
      {
        startAge: 67,
        monthlyAmount: 200_000,
        inflationAdjusted: false,
        inflationRate: 0.03,
        type: 'ellilifeyrir',
      },
    ];

    const income = calculateTotalPensionIncome(age, pensions, 0.03, 10);

    // 150k + 200k = 350k (no inflation adjustment)
    expect(income).toBe(350_000);
  });

  it('should apply inflation adjustment when enabled', () => {
    const age = 70;
    const pensions: PensionSchedule[] = [
      {
        startAge: 60,
        monthlyAmount: 150_000,
        inflationAdjusted: true,
        inflationRate: 0.03,
        type: 'lifeyrissjodur',
      },
    ];

    const income = calculateTotalPensionIncome(age, pensions, 0.03, 10);

    // 10 years of pension, inflation-adjusted
    const yearsSincePensionStart = age - 60; // 10 years
    const inflationFactor = Math.pow(1.03, yearsSincePensionStart);
    const expectedIncome = 150_000 * inflationFactor;

    expect(income).toBeCloseTo(expectedIncome, 2);
  });

  it('should return zero for pensions not yet started', () => {
    const age = 59;
    const pensions: PensionSchedule[] = [
      {
        startAge: 60,
        monthlyAmount: 150_000,
        inflationAdjusted: false,
        inflationRate: 0.03,
        type: 'lifeyrissjodur',
      },
    ];

    const income = calculateTotalPensionIncome(age, pensions, 0.03, 0);

    expect(income).toBe(0);
  });
});

describe('prepareSimulationConfig', () => {
  it('should convert RetirementSimulation to SimulationConfig', () => {
    const retirementDate = new Date();
    retirementDate.setFullYear(retirementDate.getFullYear() + 5);

    const simulation: RetirementSimulation = {
      retirementDate,
      currentAge: 35,
      currentDate: new Date(),
      lifeExpectancy: DEFAULT_LIFE_EXPECTANCY,
      portfolio: {
        currentBalance: 5_000_000,
        monthlySavings: 200_000,
        expectedRealReturn: DEFAULT_EXPECTED_RETURN,
        inflationRate: DEFAULT_INFLATION_RATE,
        returnVolatility: DEFAULT_RETURN_VOLATILITY,
      },
      expenses: {
        source: 'manual',
        monthlyExpenses: 300_000,
        retirementAdjustment: 1.0,
      },
      pensions: {
        lifeyrissjodur: {
          enabled: true,
          startAge: 60,
          monthlyAmount: 150_000,
          inflationAdjusted: true,
        },
        sereign: {
          enabled: false,
          startAge: 60,
          monthlyAmount: 100_000,
          inflationAdjusted: true,
        },
        ellilifeyrir: {
          enabled: true,
          startAge: 67,
          monthlyAmount: 200_000,
          inflationAdjusted: true,
        },
      },
      assumptions: {
        scenarioCount: 1000,
        simulationType: 'monteCarlo',
        returnDistribution: 'lognormal',
        sequenceRiskEnabled: true,
      },
      withdrawalStrategy: {
        type: '4percent',
        rate: 0.04,
        inflationAdjusted: true,
      },
    };

    const config = prepareSimulationConfig(simulation);

    expect(config.currentAge).toBe(35);
    expect(config.retirementAge).toBeCloseTo(40, 0); // ~5 years from now
    expect(config.currentPortfolio).toBe(5_000_000);
    expect(config.monthlySavings).toBe(200_000);
    expect(config.monthlyExpenses).toBe(300_000); // 300k * 1.0 adjustment
    expect(config.lifeExpectancy).toBe(DEFAULT_LIFE_EXPECTANCY);
    expect(config.expectedReturn).toBe(DEFAULT_EXPECTED_RETURN);
    expect(config.returnVolatility).toBe(DEFAULT_RETURN_VOLATILITY);
    expect(config.inflationRate).toBe(DEFAULT_INFLATION_RATE);
    expect(config.pensionIncomes).toHaveLength(2);
    expect(config.scenarioCount).toBe(1000);
  });

  it('should handle pensions disabled', () => {
    const retirementDate = new Date();
    retirementDate.setFullYear(retirementDate.getFullYear() + 10);

    const simulation: RetirementSimulation = {
      retirementDate,
      currentAge: 50,
      currentDate: new Date(),
      lifeExpectancy: 90,
      portfolio: {
        currentBalance: 10_000_000,
        monthlySavings: 0,
        expectedRealReturn: 0.06,
        inflationRate: 0.03,
        returnVolatility: 0.15,
      },
      expenses: {
        source: 'manual',
        monthlyExpenses: 400_000,
        retirementAdjustment: 0.8,
      },
      pensions: {
        lifeyrissjodur: {
          enabled: false,
          startAge: 60,
          monthlyAmount: 0,
          inflationAdjusted: false,
        },
        sereign: {
          enabled: false,
          startAge: 60,
          monthlyAmount: 0,
          inflationAdjusted: false,
        },
        ellilifeyrir: {
          enabled: false,
          startAge: 67,
          monthlyAmount: 0,
          inflationAdjusted: false,
        },
      },
      assumptions: {
        scenarioCount: 5000,
        simulationType: 'monteCarlo',
        returnDistribution: 'lognormal',
        sequenceRiskEnabled: true,
      },
      withdrawalStrategy: {
        type: 'variable',
        percentageOfPortfolio: 0.035,
      },
    };

    const config = prepareSimulationConfig(simulation);

    expect(config.pensionIncomes).toHaveLength(0);
    expect(config.retirementAge).toBeCloseTo(60, 0);
    expect(config.yearsInRetirement).toBe(30); // 90 - 60
  });
});
