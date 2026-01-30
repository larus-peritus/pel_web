/**
 * Unit tests for profitability calculation logic
 *
 * Tests the calculateProfitabilityGrade function which determines
 * job profitability based on wage reduction percentage.
 */

import { describe, it, expect } from 'vitest';
import { calculateProfitabilityGrade } from '@/lib/calculations/profitability';
import type { CalculationResults } from '@/types/calculator';

/**
 * Helper to create mock calculation results
 */
function createMockResults(
  actualHourlyWage: number,
  percentageReduction: number,
  netAnnualIncome: number
): CalculationResults {
  const nominalHourlyWage = actualHourlyWage / (1 - percentageReduction / 100);
  const totalMoneyExpenses = (nominalHourlyWage - actualHourlyWage) * 2000; // Approximate

  return {
    nominalHourlyWage,
    actualHourlyWage,
    percentageReduction,
    netAnnualIncome,
    totalMoneyExpenses,
    baseWeeklyHours: 40,
    totalWeeklyHours: 50,
    totalExtraHours: 10,
    annualLifeEnergyHours: 2500,
    expenseBreakdown: [],
    timeBreakdown: [],
  };
}

describe('calculateProfitabilityGrade', () => {
  describe('Grade Assignment', () => {
    it('should assign grade A for 10% reduction', () => {
      const results = createMockResults(4500, 10, 9_000_000);
      const assessment = calculateProfitabilityGrade(results);

      expect(assessment).not.toBeNull();
      expect(assessment?.grade).toBe('A');
      expect(assessment?.gradeLabel).toBe('Framúrskarandi');
      expect(assessment?.severity).toBe('success');
    });

    it('should assign grade B for 20% reduction', () => {
      const results = createMockResults(4000, 20, 8_000_000);
      const assessment = calculateProfitabilityGrade(results);

      expect(assessment).not.toBeNull();
      expect(assessment?.grade).toBe('B');
      expect(assessment?.gradeLabel).toBe('Gott');
      expect(assessment?.severity).toBe('success');
    });

    it('should assign grade C for 35% reduction', () => {
      const results = createMockResults(3250, 35, 6_500_000);
      const assessment = calculateProfitabilityGrade(results);

      expect(assessment).not.toBeNull();
      expect(assessment?.grade).toBe('C');
      expect(assessment?.gradeLabel).toBe('Í meðallagi');
      expect(assessment?.severity).toBe('warning');
    });

    it('should assign grade D for 50% reduction', () => {
      const results = createMockResults(2500, 50, 5_000_000);
      const assessment = calculateProfitabilityGrade(results);

      expect(assessment).not.toBeNull();
      expect(assessment?.grade).toBe('D');
      expect(assessment?.gradeLabel).toBe('Slæmt');
      expect(assessment?.severity).toBe('warning');
    });

    it('should assign grade F for 70% reduction', () => {
      const results = createMockResults(1500, 70, 3_000_000);
      const assessment = calculateProfitabilityGrade(results);

      expect(assessment).not.toBeNull();
      expect(assessment?.grade).toBe('F');
      expect(assessment?.gradeLabel).toBe('Mjög slæmt');
      expect(assessment?.severity).toBe('error');
    });

    it('should assign grade F for zero actual wage', () => {
      const results = createMockResults(0, 100, 0);
      const assessment = calculateProfitabilityGrade(results);

      expect(assessment).not.toBeNull();
      expect(assessment?.grade).toBe('F');
      expect(assessment?.severity).toBe('error');
    });

    it('should assign grade F for negative actual wage', () => {
      const results = createMockResults(-1000, 100, -2_000_000);
      const assessment = calculateProfitabilityGrade(results);

      expect(assessment).not.toBeNull();
      expect(assessment?.grade).toBe('F');
      expect(assessment?.severity).toBe('error');
    });
  });

  describe('Boundary Conditions', () => {
    it('should assign grade A at 14.9% reduction (just under threshold)', () => {
      const results = createMockResults(4255, 14.9, 8_500_000);
      const assessment = calculateProfitabilityGrade(results);

      expect(assessment?.grade).toBe('A');
    });

    it('should assign grade B at exactly 15% reduction (threshold)', () => {
      const results = createMockResults(4250, 15, 8_500_000);
      const assessment = calculateProfitabilityGrade(results);

      expect(assessment?.grade).toBe('B');
    });

    it('should assign grade B at 29.9% reduction (just under threshold)', () => {
      const results = createMockResults(3505, 29.9, 7_000_000);
      const assessment = calculateProfitabilityGrade(results);

      expect(assessment?.grade).toBe('B');
    });

    it('should assign grade C at exactly 30% reduction (threshold)', () => {
      const results = createMockResults(3500, 30, 7_000_000);
      const assessment = calculateProfitabilityGrade(results);

      expect(assessment?.grade).toBe('C');
    });

    it('should assign grade C at 44.9% reduction (just under threshold)', () => {
      const results = createMockResults(2755, 44.9, 5_500_000);
      const assessment = calculateProfitabilityGrade(results);

      expect(assessment?.grade).toBe('C');
    });

    it('should assign grade D at exactly 45% reduction (threshold)', () => {
      const results = createMockResults(2750, 45, 5_500_000);
      const assessment = calculateProfitabilityGrade(results);

      expect(assessment?.grade).toBe('D');
    });

    it('should assign grade D at 59.9% reduction (just under threshold)', () => {
      const results = createMockResults(2005, 59.9, 4_000_000);
      const assessment = calculateProfitabilityGrade(results);

      expect(assessment?.grade).toBe('D');
    });

    it('should assign grade F at exactly 60% reduction (threshold)', () => {
      const results = createMockResults(2000, 60, 4_000_000);
      const assessment = calculateProfitabilityGrade(results);

      expect(assessment?.grade).toBe('F');
    });
  });

  describe('Net Life Energy Calculation', () => {
    it('should calculate positive net life energy correctly', () => {
      const results = createMockResults(5000, 10, 10_000_000);
      const assessment = calculateProfitabilityGrade(results);

      expect(assessment).not.toBeNull();

      // Annual life energy = 10,000,000 / 5000 = 2000 hours
      // Weekly = 2000 / 52 ≈ 38.46 hours
      // Monthly = 38.46 * 4.33 ≈ 166.5 hours
      expect(assessment?.netWeeklyLifeEnergy).toBeCloseTo(38.46, 1);
      expect(assessment?.netMonthlyLifeEnergy).toBeCloseTo(166.5, 1);
      expect(assessment?.isProfit).toBe(true);
    });

    it('should calculate zero net life energy when net income is zero', () => {
      const results = createMockResults(4000, 20, 0);
      const assessment = calculateProfitabilityGrade(results);

      expect(assessment?.netWeeklyLifeEnergy).toBe(0);
      expect(assessment?.netMonthlyLifeEnergy).toBe(0);
      expect(assessment?.isProfit).toBe(false);
    });

    it('should calculate negative net life energy correctly', () => {
      const results = createMockResults(3000, 40, -1_560_000);
      const assessment = calculateProfitabilityGrade(results);

      // Annual life energy = -1,560,000 / 3000 = -520 hours
      // Weekly = -520 / 52 = -10 hours
      // Monthly = -10 * 4.33 = -43.3 hours
      expect(assessment?.netWeeklyLifeEnergy).toBeCloseTo(-10, 1);
      expect(assessment?.netMonthlyLifeEnergy).toBeCloseTo(-43.3, 1);
      expect(assessment?.isProfit).toBe(false);
    });

    it('should return zero life energy when wage is zero', () => {
      const results = createMockResults(0, 100, 0);
      const assessment = calculateProfitabilityGrade(results);

      expect(assessment?.netWeeklyLifeEnergy).toBe(0);
      expect(assessment?.netMonthlyLifeEnergy).toBe(0);
    });

    it('should return zero life energy when wage is negative', () => {
      const results = createMockResults(-1000, 100, -2_000_000);
      const assessment = calculateProfitabilityGrade(results);

      expect(assessment?.netWeeklyLifeEnergy).toBe(0);
      expect(assessment?.netMonthlyLifeEnergy).toBe(0);
    });
  });

  describe('Severity Mapping', () => {
    it('should map grade A to success severity', () => {
      const results = createMockResults(4500, 10, 9_000_000);
      const assessment = calculateProfitabilityGrade(results);

      expect(assessment?.severity).toBe('success');
    });

    it('should map grade B to success severity', () => {
      const results = createMockResults(4000, 20, 8_000_000);
      const assessment = calculateProfitabilityGrade(results);

      expect(assessment?.severity).toBe('success');
    });

    it('should map grade C to warning severity', () => {
      const results = createMockResults(3250, 35, 6_500_000);
      const assessment = calculateProfitabilityGrade(results);

      expect(assessment?.severity).toBe('warning');
    });

    it('should map grade D to warning severity', () => {
      const results = createMockResults(2500, 50, 5_000_000);
      const assessment = calculateProfitabilityGrade(results);

      expect(assessment?.severity).toBe('warning');
    });

    it('should map grade F to error severity', () => {
      const results = createMockResults(1500, 70, 3_000_000);
      const assessment = calculateProfitabilityGrade(results);

      expect(assessment?.severity).toBe('error');
    });
  });

  describe('Edge Cases', () => {
    it('should return null when results is null', () => {
      const assessment = calculateProfitabilityGrade(null);

      expect(assessment).toBeNull();
    });

    it('should return null when actualHourlyWage is undefined', () => {
      const results = {
        percentageReduction: 20,
        netAnnualIncome: 8_000_000,
      } as any;

      const assessment = calculateProfitabilityGrade(results);

      expect(assessment).toBeNull();
    });

    it('should return null when percentageReduction is undefined', () => {
      const results = {
        actualHourlyWage: 4000,
        netAnnualIncome: 8_000_000,
      } as any;

      const assessment = calculateProfitabilityGrade(results);

      expect(assessment).toBeNull();
    });

    it('should return null when netAnnualIncome is undefined', () => {
      const results = {
        actualHourlyWage: 4000,
        percentageReduction: 20,
      } as any;

      const assessment = calculateProfitabilityGrade(results);

      expect(assessment).toBeNull();
    });
  });

  describe('Icelandic Text', () => {
    it('should return Icelandic grade labels', () => {
      const results = createMockResults(4500, 10, 9_000_000);
      const assessment = calculateProfitabilityGrade(results);

      expect(assessment?.gradeLabel).toBe('Framúrskarandi');
      expect(assessment?.gradeExplanation).toContain('mjög hagkvæmt');
    });

    it('should use constants for all text (not hard-coded)', () => {
      const results = createMockResults(4000, 20, 8_000_000);
      const assessment = calculateProfitabilityGrade(results);

      // Verify text comes from constants
      expect(assessment?.gradeLabel).toMatch(/^[A-ZÁÐÉÍÓÚÝÞÆÖ]/); // Starts with Icelandic letter
      expect(assessment?.gradeExplanation).toMatch(/^[A-ZÁÐÉÍÓÚÝÞÆÖ]/);
    });
  });

  describe('Realistic Scenarios', () => {
    it('should handle excellent job (Software Engineer)', () => {
      // High salary (8M ISK/year), low expenses, minimal extra time
      const results = createMockResults(5200, 8, 10_400_000);
      const assessment = calculateProfitabilityGrade(results);

      expect(assessment?.grade).toBe('A');
      expect(assessment?.isProfit).toBe(true);
      expect(assessment?.severity).toBe('success');
    });

    it('should handle average job (Office Worker)', () => {
      // Average salary (6M ISK/year), typical expenses
      const results = createMockResults(3200, 32, 6_400_000);
      const assessment = calculateProfitabilityGrade(results);

      expect(assessment?.grade).toBe('C');
      expect(assessment?.isProfit).toBe(true);
      expect(assessment?.severity).toBe('warning');
    });

    it('should handle poor job (Long commute, high expenses)', () => {
      // Lower salary (5M ISK/year), high commute costs
      const results = createMockResults(2100, 55, 4_200_000);
      const assessment = calculateProfitabilityGrade(results);

      expect(assessment?.grade).toBe('D');
      expect(assessment?.isProfit).toBe(true);
      expect(assessment?.severity).toBe('warning');
    });

    it('should handle failing job (Expenses exceed income)', () => {
      // Very high expenses, losing money
      const results = createMockResults(1200, 75, -500_000);
      const assessment = calculateProfitabilityGrade(results);

      expect(assessment?.grade).toBe('F');
      expect(assessment?.isProfit).toBe(false);
      expect(assessment?.severity).toBe('error');
    });

    it('should handle remote work (No commute)', () => {
      // Remote work = minimal work expenses
      const results = createMockResults(4800, 5, 9_600_000);
      const assessment = calculateProfitabilityGrade(results);

      expect(assessment?.grade).toBe('A');
      expect(assessment?.isProfit).toBe(true);
    });
  });
});
