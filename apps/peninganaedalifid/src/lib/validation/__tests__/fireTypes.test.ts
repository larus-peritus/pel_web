/**
 * Unit tests for FIRE Type validation functions
 */

import { validateUserInputs, validateAssumptions } from '../fireTypes';
import type { UserFinancialInputs, FIREAssumptions } from '@/types/fireTypes';

describe('validateUserInputs', () => {
  describe('Age validation', () => {
    it('should reject age below minimum', () => {
      const result = validateUserInputs({ currentAge: 17 });
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].field).toBe('currentAge');
      expect(result.errors[0].message).toContain('18');
    });

    it('should reject age above maximum', () => {
      const result = validateUserInputs({ currentAge: 81 });
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].field).toBe('currentAge');
    });

    it('should warn for age over 60', () => {
      const result = validateUserInputs({ currentAge: 65 });
      expect(result.isValid).toBe(true);
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0].field).toBe('currentAge');
    });

    it('should accept valid age', () => {
      const result = validateUserInputs({ currentAge: 35 });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Target retirement age validation', () => {
    it('should reject target age below minimum', () => {
      const result = validateUserInputs({
        currentAge: 30,
        targetRetirementAge: 24,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.field === 'targetRetirementAge')).toBe(true);
    });

    it('should reject target age above maximum', () => {
      const result = validateUserInputs({
        currentAge: 30,
        targetRetirementAge: 91,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.field === 'targetRetirementAge')).toBe(true);
    });

    it('should reject target age less than or equal to current age', () => {
      const result = validateUserInputs({
        currentAge: 40,
        targetRetirementAge: 40,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.field === 'targetRetirementAge')).toBe(true);
    });

    it('should warn for very early retirement', () => {
      const result = validateUserInputs({
        currentAge: 25,
        targetRetirementAge: 35,
      });
      expect(result.isValid).toBe(true);
      expect(result.warnings.some((w) => w.field === 'targetRetirementAge')).toBe(true);
    });

    it('should accept valid target age', () => {
      const result = validateUserInputs({
        currentAge: 30,
        targetRetirementAge: 50,
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Net worth validation', () => {
    it('should reject negative net worth', () => {
      const result = validateUserInputs({ currentNetWorth: -1000 });
      expect(result.isValid).toBe(false);
      expect(result.errors[0].field).toBe('currentNetWorth');
    });

    it('should reject unrealistically high net worth', () => {
      const result = validateUserInputs({ currentNetWorth: 20_000_000_000 });
      expect(result.isValid).toBe(false);
      expect(result.errors[0].field).toBe('currentNetWorth');
    });

    it('should accept valid net worth', () => {
      const result = validateUserInputs({ currentNetWorth: 5_000_000 });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should accept zero net worth', () => {
      const result = validateUserInputs({ currentNetWorth: 0 });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Annual income validation', () => {
    it('should reject zero or negative income', () => {
      const result = validateUserInputs({ annualIncome: 0 });
      expect(result.isValid).toBe(false);
      expect(result.errors[0].field).toBe('annualIncome');
    });

    it('should reject unrealistically high income', () => {
      const result = validateUserInputs({ annualIncome: 600_000_000 });
      expect(result.isValid).toBe(false);
      expect(result.errors[0].field).toBe('annualIncome');
    });

    it('should warn for very low income', () => {
      const result = validateUserInputs({ annualIncome: 1_500_000 });
      expect(result.isValid).toBe(true);
      expect(result.warnings.some((w) => w.field === 'annualIncome')).toBe(true);
    });

    it('should accept valid income', () => {
      const result = validateUserInputs({ annualIncome: 6_000_000 });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Annual savings validation', () => {
    it('should reject negative savings', () => {
      const result = validateUserInputs({ annualSavings: -1000 });
      expect(result.isValid).toBe(false);
      expect(result.errors[0].field).toBe('annualSavings');
    });

    it('should reject unrealistically high savings', () => {
      const result = validateUserInputs({ annualSavings: 150_000_000 });
      expect(result.isValid).toBe(false);
      expect(result.errors[0].field).toBe('annualSavings');
    });

    it('should reject savings higher than income', () => {
      const result = validateUserInputs({
        annualIncome: 5_000_000,
        annualSavings: 6_000_000,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.field === 'annualSavings')).toBe(true);
    });

    it('should accept zero savings', () => {
      const result = validateUserInputs({ annualSavings: 0 });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should accept valid savings', () => {
      const result = validateUserInputs({
        annualIncome: 6_000_000,
        annualSavings: 2_000_000,
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Savings rate validation', () => {
    it('should reject negative savings rate', () => {
      const result = validateUserInputs({ savingsRate: -5 });
      expect(result.isValid).toBe(false);
      expect(result.errors[0].field).toBe('savingsRate');
    });

    it('should reject savings rate over 100%', () => {
      const result = validateUserInputs({ savingsRate: 105 });
      expect(result.isValid).toBe(false);
      expect(result.errors[0].field).toBe('savingsRate');
    });

    it('should warn for low savings rate', () => {
      const result = validateUserInputs({ savingsRate: 5 });
      expect(result.isValid).toBe(true);
      expect(result.warnings.some((w) => w.field === 'savingsRate')).toBe(true);
    });

    it('should warn for very high savings rate', () => {
      const result = validateUserInputs({ savingsRate: 75 });
      expect(result.isValid).toBe(true);
      expect(result.warnings.some((w) => w.field === 'savingsRate')).toBe(true);
    });

    it('should accept valid savings rate', () => {
      const result = validateUserInputs({ savingsRate: 35 });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Monthly expenses validation', () => {
    it('should reject barebones expenses below minimum', () => {
      const result = validateUserInputs({
        monthlyExpenses: {
          barebones: 40_000,
          comfortable: 200_000,
          deluxe: 400_000,
        },
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.field === 'monthlyExpenses.barebones')).toBe(true);
    });

    it('should reject comfortable expenses above maximum', () => {
      const result = validateUserInputs({
        monthlyExpenses: {
          barebones: 150_000,
          comfortable: 6_000_000,
          deluxe: 8_000_000,
        },
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.field === 'monthlyExpenses.comfortable')).toBe(true);
    });

    it('should warn if barebones > comfortable', () => {
      const result = validateUserInputs({
        monthlyExpenses: {
          barebones: 300_000,
          comfortable: 200_000,
          deluxe: 400_000,
        },
      });
      expect(result.isValid).toBe(true);
      expect(result.warnings.some((w) => w.field === 'monthlyExpenses')).toBe(true);
    });

    it('should warn if comfortable > deluxe', () => {
      const result = validateUserInputs({
        monthlyExpenses: {
          barebones: 150_000,
          comfortable: 400_000,
          deluxe: 300_000,
        },
      });
      expect(result.isValid).toBe(true);
      expect(result.warnings.some((w) => w.field === 'monthlyExpenses')).toBe(true);
    });

    it('should accept valid expense tiers', () => {
      const result = validateUserInputs({
        monthlyExpenses: {
          barebones: 150_000,
          comfortable: 300_000,
          deluxe: 500_000,
        },
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Complete user inputs validation', () => {
    it('should validate all fields together', () => {
      const inputs: Partial<UserFinancialInputs> = {
        currentAge: 35,
        targetRetirementAge: 50,
        currentNetWorth: 10_000_000,
        annualIncome: 8_000_000,
        annualSavings: 3_000_000,
        savingsRate: 37.5,
        monthlyExpenses: {
          barebones: 200_000,
          comfortable: 350_000,
          deluxe: 600_000,
        },
      };

      const result = validateUserInputs(inputs);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should handle partial inputs', () => {
      const result = validateUserInputs({ currentAge: 30 });
      expect(result.isValid).toBe(true);
    });

    it('should accumulate multiple errors', () => {
      const inputs: Partial<UserFinancialInputs> = {
        currentAge: 15, // Too young
        targetRetirementAge: 95, // Too old
        currentNetWorth: -5000, // Negative
        annualIncome: 0, // Zero
      };

      const result = validateUserInputs(inputs);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(4);
    });
  });
});

describe('validateAssumptions', () => {
  describe('Withdrawal rate validation', () => {
    it('should reject withdrawal rate below 2%', () => {
      const result = validateAssumptions({ withdrawalRate: 0.015 });
      expect(result.isValid).toBe(false);
      expect(result.errors[0].field).toBe('withdrawalRate');
    });

    it('should reject withdrawal rate above 10%', () => {
      const result = validateAssumptions({ withdrawalRate: 0.12 });
      expect(result.isValid).toBe(false);
      expect(result.errors[0].field).toBe('withdrawalRate');
    });

    it('should warn for high withdrawal rate', () => {
      const result = validateAssumptions({ withdrawalRate: 0.06 });
      expect(result.isValid).toBe(true);
      expect(result.warnings.some((w) => w.field === 'withdrawalRate')).toBe(true);
    });

    it('should warn for very low withdrawal rate', () => {
      const result = validateAssumptions({ withdrawalRate: 0.025 });
      expect(result.isValid).toBe(true);
      expect(result.warnings.some((w) => w.field === 'withdrawalRate')).toBe(true);
    });

    it('should accept valid withdrawal rate', () => {
      const result = validateAssumptions({ withdrawalRate: 0.04 });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Expected growth rate validation', () => {
    it('should reject negative growth rate', () => {
      const result = validateAssumptions({ expectedGrowthRate: -0.02 });
      expect(result.isValid).toBe(false);
      expect(result.errors[0].field).toBe('expectedGrowthRate');
    });

    it('should reject unrealistically high growth rate', () => {
      const result = validateAssumptions({ expectedGrowthRate: 0.20 });
      expect(result.isValid).toBe(false);
      expect(result.errors[0].field).toBe('expectedGrowthRate');
    });

    it('should warn for optimistic growth rate', () => {
      const result = validateAssumptions({ expectedGrowthRate: 0.12 });
      expect(result.isValid).toBe(true);
      expect(result.warnings.some((w) => w.field === 'expectedGrowthRate')).toBe(true);
    });

    it('should warn for pessimistic growth rate', () => {
      const result = validateAssumptions({ expectedGrowthRate: 0.03 });
      expect(result.isValid).toBe(true);
      expect(result.warnings.some((w) => w.field === 'expectedGrowthRate')).toBe(true);
    });

    it('should accept valid growth rate', () => {
      const result = validateAssumptions({ expectedGrowthRate: 0.07 });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Inflation rate validation', () => {
    it('should reject negative inflation', () => {
      const result = validateAssumptions({ inflationRate: -0.01 });
      expect(result.isValid).toBe(false);
      expect(result.errors[0].field).toBe('inflationRate');
    });

    it('should reject unrealistically high inflation', () => {
      const result = validateAssumptions({ inflationRate: 0.15 });
      expect(result.isValid).toBe(false);
      expect(result.errors[0].field).toBe('inflationRate');
    });

    it('should warn for high inflation', () => {
      const result = validateAssumptions({ inflationRate: 0.06 });
      expect(result.isValid).toBe(true);
      expect(result.warnings.some((w) => w.field === 'inflationRate')).toBe(true);
    });

    it('should accept valid inflation rate', () => {
      const result = validateAssumptions({ inflationRate: 0.025 });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Pension age validation', () => {
    it('should reject pension age below 55', () => {
      const result = validateAssumptions({ pensionAge: 50 });
      expect(result.isValid).toBe(false);
      expect(result.errors[0].field).toBe('pensionAge');
    });

    it('should reject pension age above 75', () => {
      const result = validateAssumptions({ pensionAge: 80 });
      expect(result.isValid).toBe(false);
      expect(result.errors[0].field).toBe('pensionAge');
    });

    it('should warn if pension age is not 67', () => {
      const result = validateAssumptions({ pensionAge: 65 });
      expect(result.isValid).toBe(true);
      expect(result.warnings.some((w) => w.field === 'pensionAge')).toBe(true);
    });

    it('should accept valid pension age without warning', () => {
      const result = validateAssumptions({ pensionAge: 67 });
      expect(result.isValid).toBe(true);
      expect(result.warnings).toHaveLength(0);
    });
  });

  describe('Pension monthly estimate validation', () => {
    it('should reject negative pension estimate', () => {
      const result = validateAssumptions({ pensionMonthlyEstimate: -10000 });
      expect(result.isValid).toBe(false);
      expect(result.errors[0].field).toBe('pensionMonthlyEstimate');
    });

    it('should warn for very high pension estimate', () => {
      const result = validateAssumptions({ pensionMonthlyEstimate: 1_200_000 });
      expect(result.isValid).toBe(true);
      expect(result.warnings.some((w) => w.field === 'pensionMonthlyEstimate')).toBe(true);
    });

    it('should accept valid pension estimate', () => {
      const result = validateAssumptions({ pensionMonthlyEstimate: 300_000 });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should accept null pension estimate', () => {
      const result = validateAssumptions({ pensionMonthlyEstimate: null });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Cross-field validation', () => {
    it('should warn if real return is too low', () => {
      const result = validateAssumptions({
        expectedGrowthRate: 0.05,
        inflationRate: 0.045,
      });
      expect(result.isValid).toBe(true);
      expect(result.warnings.some((w) => w.field === 'expectedGrowthRate')).toBe(true);
    });

    it('should accept reasonable real return', () => {
      const result = validateAssumptions({
        expectedGrowthRate: 0.07,
        inflationRate: 0.025,
      });
      expect(result.isValid).toBe(true);
      // Should not have real return warning
      const realReturnWarning = result.warnings.find(
        (w) => w.message.includes('Raunávöxtun')
      );
      expect(realReturnWarning).toBeUndefined();
    });
  });

  describe('Complete assumptions validation', () => {
    it('should validate all fields together', () => {
      const assumptions: Partial<FIREAssumptions> = {
        withdrawalRate: 0.04,
        expectedGrowthRate: 0.06,
        inflationRate: 0.025,
        pensionAge: 67,
        pensionMonthlyEstimate: 250_000,
      };

      const result = validateAssumptions(assumptions);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should handle partial assumptions', () => {
      const result = validateAssumptions({ withdrawalRate: 0.04 });
      expect(result.isValid).toBe(true);
    });

    it('should accumulate multiple errors', () => {
      const assumptions: Partial<FIREAssumptions> = {
        withdrawalRate: 0.15, // Too high
        expectedGrowthRate: -0.02, // Negative
        inflationRate: 0.20, // Too high
        pensionAge: 50, // Too low
      };

      const result = validateAssumptions(assumptions);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(4);
    });
  });
});
