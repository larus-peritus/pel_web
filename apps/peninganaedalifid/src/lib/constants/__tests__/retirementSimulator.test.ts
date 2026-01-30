import { describe, it, expect } from 'vitest';
import {
  DEFAULT_LIFE_EXPECTANCY,
  DEFAULT_EXPECTED_RETURN,
  DEFAULT_INFLATION_RATE,
  DEFAULT_RETURN_VOLATILITY,
  DEFAULT_SCENARIO_COUNT,
  TARGET_SUCCESS_RATE,
  SUCCESS_RATE_THRESHOLDS,
  SUCCESS_RATE_LABELS,
  SUCCESS_RATE_COLORS,
  ICELANDIC_PENSION_DEFAULTS,
  WITHDRAWAL_STRATEGY_PRESETS,
  DEFAULT_WITHDRAWAL_STRATEGY,
  RETURN_RATE_ASSUMPTIONS,
  getSuccessRateLevel,
  isExpectedReturnUnrealistic,
  isEarlyRetirement,
  getYearsToPension,
  isValidPortfolioBalance,
  isValidMonthlySavings,
  isValidMonthlyExpenses,
  isValidRetirementAge,
  isValidCurrentAge,
  isValidLifeExpectancy,
  isValidExpectedReturn,
  isValidInflationRate,
  isValidReturnVolatility,
  isValidLifeyrissjodurAge,
  isValidEllilifeyririAge,
  isValidPensionAmount,
} from '../retirementSimulator';

describe('Retirement Simulator Constants', () => {
  describe('Default Values', () => {
    it('should have reasonable default life expectancy', () => {
      expect(DEFAULT_LIFE_EXPECTANCY).toBe(92);
      expect(DEFAULT_LIFE_EXPECTANCY).toBeGreaterThan(80);
      expect(DEFAULT_LIFE_EXPECTANCY).toBeLessThan(105);
    });

    it('should have reasonable default expected return', () => {
      expect(DEFAULT_EXPECTED_RETURN).toBe(0.07); // 7%
      expect(DEFAULT_EXPECTED_RETURN).toBeGreaterThan(0);
      expect(DEFAULT_EXPECTED_RETURN).toBeLessThan(0.15);
    });

    it('should have reasonable default inflation rate', () => {
      expect(DEFAULT_INFLATION_RATE).toBe(0.03); // 3%
      expect(DEFAULT_INFLATION_RATE).toBeGreaterThan(0);
      expect(DEFAULT_INFLATION_RATE).toBeLessThan(0.1);
    });

    it('should have reasonable default return volatility', () => {
      expect(DEFAULT_RETURN_VOLATILITY).toBe(0.18); // 18%
      expect(DEFAULT_RETURN_VOLATILITY).toBeGreaterThan(0.05);
      expect(DEFAULT_RETURN_VOLATILITY).toBeLessThan(0.35);
    });

    it('should have reasonable default scenario count', () => {
      expect(DEFAULT_SCENARIO_COUNT).toBe(1000);
      expect(DEFAULT_SCENARIO_COUNT).toBeGreaterThan(0);
    });

    it('should have reasonable target success rate', () => {
      expect(TARGET_SUCCESS_RATE).toBe(0.85); // 85%
      expect(TARGET_SUCCESS_RATE).toBeGreaterThan(0);
      expect(TARGET_SUCCESS_RATE).toBeLessThan(1);
    });
  });

  describe('Success Rate Thresholds', () => {
    it('should have thresholds in descending order', () => {
      expect(SUCCESS_RATE_THRESHOLDS.excellent).toBeGreaterThan(SUCCESS_RATE_THRESHOLDS.good);
      expect(SUCCESS_RATE_THRESHOLDS.good).toBeGreaterThan(SUCCESS_RATE_THRESHOLDS.acceptable);
      expect(SUCCESS_RATE_THRESHOLDS.acceptable).toBeGreaterThan(SUCCESS_RATE_THRESHOLDS.risky);
      expect(SUCCESS_RATE_THRESHOLDS.risky).toBeGreaterThan(SUCCESS_RATE_THRESHOLDS.highRisk);
    });

    it('should have all labels in Icelandic', () => {
      expect(SUCCESS_RATE_LABELS.excellent).toBe('Framúrskarandi');
      expect(SUCCESS_RATE_LABELS.good).toBe('Gott');
      expect(SUCCESS_RATE_LABELS.acceptable).toBe('Ásættanlegt');
      expect(SUCCESS_RATE_LABELS.risky).toBe('Áhættusamt');
      expect(SUCCESS_RATE_LABELS.highRisk).toBe('Háhætta');
    });

    it('should have color coding for all levels', () => {
      expect(SUCCESS_RATE_COLORS.excellent.bg).toContain('green');
      expect(SUCCESS_RATE_COLORS.good.bg).toContain('blue');
      expect(SUCCESS_RATE_COLORS.acceptable.bg).toContain('yellow');
      expect(SUCCESS_RATE_COLORS.risky.bg).toContain('orange');
      expect(SUCCESS_RATE_COLORS.highRisk.bg).toContain('red');
    });
  });

  describe('Icelandic Pension Defaults', () => {
    it('should have correct pension ages', () => {
      expect(ICELANDIC_PENSION_DEFAULTS.LIFEYRISSJODUR_AGE).toBe(60);
      expect(ICELANDIC_PENSION_DEFAULTS.ELLILIFEYRIR_AGE).toBe(67);
    });

    it('should have reasonable typical pension amounts', () => {
      expect(ICELANDIC_PENSION_DEFAULTS.TYPICAL_LIFEYRISSJODUR_MONTHLY).toBe(150_000);
      expect(ICELANDIC_PENSION_DEFAULTS.TYPICAL_ELLILIFEYRIR_MONTHLY).toBe(200_000);
    });

    it('should have ellilifeyrir start after lífeyrissjóður', () => {
      expect(ICELANDIC_PENSION_DEFAULTS.ELLILIFEYRIR_AGE).toBeGreaterThan(
        ICELANDIC_PENSION_DEFAULTS.LIFEYRISSJODUR_AGE,
      );
    });
  });

  describe('Withdrawal Strategy Presets', () => {
    it('should have 4% rule preset', () => {
      expect(WITHDRAWAL_STRATEGY_PRESETS.FOUR_PERCENT.type).toBe('4percent');
      expect(WITHDRAWAL_STRATEGY_PRESETS.FOUR_PERCENT.rate).toBe(0.04);
      expect(WITHDRAWAL_STRATEGY_PRESETS.FOUR_PERCENT.inflationAdjusted).toBe(true);
    });

    it('should have variable spending preset', () => {
      expect(WITHDRAWAL_STRATEGY_PRESETS.VARIABLE.type).toBe('variable');
      expect(WITHDRAWAL_STRATEGY_PRESETS.VARIABLE.percentageOfPortfolio).toBe(0.04);
    });

    it('should have guardrails preset', () => {
      expect(WITHDRAWAL_STRATEGY_PRESETS.GUARDRAILS.type).toBe('guardrails');
      expect(WITHDRAWAL_STRATEGY_PRESETS.GUARDRAILS.upperGuardrail).toBe(1.3);
      expect(WITHDRAWAL_STRATEGY_PRESETS.GUARDRAILS.lowerGuardrail).toBe(0.8);
      expect(WITHDRAWAL_STRATEGY_PRESETS.GUARDRAILS.adjustmentPercent).toBe(0.1);
    });

    it('should have default withdrawal strategy as 4% rule', () => {
      expect(DEFAULT_WITHDRAWAL_STRATEGY.type).toBe('4percent');
      if (DEFAULT_WITHDRAWAL_STRATEGY.type === '4percent') {
        expect(DEFAULT_WITHDRAWAL_STRATEGY.rate).toBe(0.04);
      }
    });
  });

  describe('Return Rate Assumptions', () => {
    it('should have Iceland equity assumptions', () => {
      expect(RETURN_RATE_ASSUMPTIONS.ICELAND_EQUITY.realReturn).toBe(0.065);
      expect(RETURN_RATE_ASSUMPTIONS.ICELAND_EQUITY.volatility).toBe(0.22);
    });

    it('should have global equity assumptions', () => {
      expect(RETURN_RATE_ASSUMPTIONS.GLOBAL_EQUITY.realReturn).toBe(0.07);
      expect(RETURN_RATE_ASSUMPTIONS.GLOBAL_EQUITY.volatility).toBe(0.18);
    });

    it('should have balanced portfolio assumptions', () => {
      expect(RETURN_RATE_ASSUMPTIONS.BALANCED.realReturn).toBe(0.055);
      expect(RETURN_RATE_ASSUMPTIONS.BALANCED.volatility).toBeLessThan(
        RETURN_RATE_ASSUMPTIONS.GLOBAL_EQUITY.volatility,
      );
    });

    it('should have conservative portfolio assumptions', () => {
      expect(RETURN_RATE_ASSUMPTIONS.CONSERVATIVE.realReturn).toBe(0.04);
      expect(RETURN_RATE_ASSUMPTIONS.CONSERVATIVE.volatility).toBeLessThan(
        RETURN_RATE_ASSUMPTIONS.BALANCED.volatility,
      );
    });
  });

  describe('Helper Functions', () => {
    describe('getSuccessRateLevel', () => {
      it('should return "excellent" for 95% success rate', () => {
        expect(getSuccessRateLevel(0.95)).toBe('excellent');
      });

      it('should return "good" for 85% success rate', () => {
        expect(getSuccessRateLevel(0.85)).toBe('good');
      });

      it('should return "acceptable" for 75% success rate', () => {
        expect(getSuccessRateLevel(0.75)).toBe('acceptable');
      });

      it('should return "risky" for 65% success rate', () => {
        expect(getSuccessRateLevel(0.65)).toBe('risky');
      });

      it('should return "highRisk" for 50% success rate', () => {
        expect(getSuccessRateLevel(0.5)).toBe('highRisk');
      });

      it('should return correct level at threshold boundaries', () => {
        expect(getSuccessRateLevel(0.9)).toBe('excellent'); // Exactly at threshold
        expect(getSuccessRateLevel(0.8)).toBe('good'); // Exactly at threshold
        expect(getSuccessRateLevel(0.7)).toBe('acceptable'); // Exactly at threshold
        expect(getSuccessRateLevel(0.6)).toBe('risky'); // Exactly at threshold
      });
    });

    describe('isExpectedReturnUnrealistic', () => {
      it('should return false for 7% return', () => {
        expect(isExpectedReturnUnrealistic(0.07)).toBe(false);
      });

      it('should return false for 10% return', () => {
        expect(isExpectedReturnUnrealistic(0.1)).toBe(false);
      });

      it('should return true for 15% return', () => {
        expect(isExpectedReturnUnrealistic(0.15)).toBe(true);
      });

      it('should return true for 20% return', () => {
        expect(isExpectedReturnUnrealistic(0.2)).toBe(true);
      });
    });

    describe('isEarlyRetirement', () => {
      it('should return true for retirement at 55', () => {
        expect(isEarlyRetirement(55)).toBe(true);
      });

      it('should return true for retirement at 60', () => {
        expect(isEarlyRetirement(60)).toBe(true);
      });

      it('should return false for retirement at 67', () => {
        expect(isEarlyRetirement(67)).toBe(false);
      });

      it('should return false for retirement at 70', () => {
        expect(isEarlyRetirement(70)).toBe(false);
      });
    });

    describe('getYearsToPension', () => {
      it('should calculate correct years for retirement at 60', () => {
        expect(getYearsToPension(60)).toBe(7); // 67 - 60
      });

      it('should calculate correct years for retirement at 55', () => {
        expect(getYearsToPension(55)).toBe(12); // 67 - 55
      });

      it('should return 0 for retirement at 67', () => {
        expect(getYearsToPension(67)).toBe(0);
      });

      it('should return 0 for retirement after pension age', () => {
        expect(getYearsToPension(70)).toBe(0);
      });

      it('should accept custom pension age', () => {
        expect(getYearsToPension(55, 60)).toBe(5); // 60 - 55
      });
    });

    describe('Validation Functions', () => {
      it('should validate portfolio balance range', () => {
        expect(isValidPortfolioBalance(5_000_000)).toBe(true);
        expect(isValidPortfolioBalance(-100)).toBe(false);
        expect(isValidPortfolioBalance(2_000_000_000)).toBe(false);
      });

      it('should validate monthly savings range', () => {
        expect(isValidMonthlySavings(100_000)).toBe(true);
        expect(isValidMonthlySavings(-50_000)).toBe(false);
        expect(isValidMonthlySavings(20_000_000)).toBe(false);
      });

      it('should validate monthly expenses range', () => {
        expect(isValidMonthlyExpenses(300_000)).toBe(true);
        expect(isValidMonthlyExpenses(-10_000)).toBe(false);
        expect(isValidMonthlyExpenses(15_000_000)).toBe(false);
      });

      it('should validate retirement age range', () => {
        expect(isValidRetirementAge(55)).toBe(true);
        expect(isValidRetirementAge(67)).toBe(true);
        expect(isValidRetirementAge(30)).toBe(false);
        expect(isValidRetirementAge(90)).toBe(false);
      });

      it('should validate current age range', () => {
        expect(isValidCurrentAge(35)).toBe(true);
        expect(isValidCurrentAge(18)).toBe(true);
        expect(isValidCurrentAge(10)).toBe(false);
        expect(isValidCurrentAge(105)).toBe(false);
      });

      it('should validate life expectancy with retirement age', () => {
        expect(isValidLifeExpectancy(92, 67)).toBe(true);
        expect(isValidLifeExpectancy(85, 67)).toBe(true);
        expect(isValidLifeExpectancy(65, 67)).toBe(false); // Before retirement
        expect(isValidLifeExpectancy(110, 67)).toBe(false); // Too high
      });

      it('should validate expected return range', () => {
        expect(isValidExpectedReturn(0.07)).toBe(true);
        expect(isValidExpectedReturn(0.0)).toBe(true);
        expect(isValidExpectedReturn(-0.05)).toBe(false);
        expect(isValidExpectedReturn(0.2)).toBe(false);
      });

      it('should validate inflation rate range', () => {
        expect(isValidInflationRate(0.03)).toBe(true);
        expect(isValidInflationRate(0.0)).toBe(true);
        expect(isValidInflationRate(-0.01)).toBe(false);
        expect(isValidInflationRate(0.15)).toBe(false);
      });

      it('should validate return volatility range', () => {
        expect(isValidReturnVolatility(0.18)).toBe(true);
        expect(isValidReturnVolatility(0.05)).toBe(true);
        expect(isValidReturnVolatility(0.02)).toBe(false);
        expect(isValidReturnVolatility(0.5)).toBe(false);
      });

      it('should validate lífeyrissjóður age range', () => {
        expect(isValidLifeyrissjodurAge(60)).toBe(true);
        expect(isValidLifeyrissjodurAge(65)).toBe(true);
        expect(isValidLifeyrissjodurAge(55)).toBe(false);
        expect(isValidLifeyrissjodurAge(75)).toBe(false);
      });

      it('should validate ellilífeyrir age range', () => {
        expect(isValidEllilifeyririAge(67)).toBe(true);
        expect(isValidEllilifeyririAge(70)).toBe(true);
        expect(isValidEllilifeyririAge(60)).toBe(false);
        expect(isValidEllilifeyririAge(80)).toBe(false);
      });

      it('should validate pension amount range', () => {
        expect(isValidPensionAmount(200_000)).toBe(true);
        expect(isValidPensionAmount(0)).toBe(true);
        expect(isValidPensionAmount(-50_000)).toBe(false);
        expect(isValidPensionAmount(2_000_000)).toBe(false);
      });
    });
  });
});
