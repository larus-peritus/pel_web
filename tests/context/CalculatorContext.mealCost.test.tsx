/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CalculatorProvider, useCalculator } from '@/context/CalculatorContext';
import type { EatingOutData, HomeCookingData } from '@/types/calculator';

describe('CalculatorContext - Meal Cost Integration', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <CalculatorProvider>{children}</CalculatorProvider>
  );

  describe('Initial State', () => {
    it('should initialize with default meal cost data', () => {
      const { result } = renderHook(() => useCalculator(), { wrapper });

      expect(result.current.mealCostData).toBeDefined();
      expect(result.current.mealCostData.eatingOut).toBeDefined();
      expect(result.current.mealCostData.homeCooking).toBeDefined();
    });

    it('should have default eating out values', () => {
      const { result } = renderHook(() => useCalculator(), { wrapper });

      const { eatingOut } = result.current.mealCostData;
      expect(eatingOut.breakfastCount).toBe(0);
      expect(eatingOut.lunchCount).toBe(5);
      expect(eatingOut.dinnerCount).toBe(2);
      expect(eatingOut.coffeeCount).toBe(5);
      expect(eatingOut.fastFoodCount).toBe(1);
    });

    it('should have default home cooking values', () => {
      const { result } = renderHook(() => useCalculator(), { wrapper });

      const { homeCooking } = result.current.mealCostData;
      expect(homeCooking.monthlyGroceryCost).toBe(80000);
      expect(homeCooking.householdSize).toBe(2);
      expect(homeCooking.shoppingHoursPerWeek).toBe(2);
      expect(homeCooking.cookingHoursPerWeek).toBe(7);
    });
  });

  describe('Update Functions', () => {
    it('should update eating out data', () => {
      const { result } = renderHook(() => useCalculator(), { wrapper });

      act(() => {
        result.current.updateEatingOut({ lunchCount: 7, lunchCost: 3000 });
      });

      expect(result.current.mealCostData.eatingOut.lunchCount).toBe(7);
      expect(result.current.mealCostData.eatingOut.lunchCost).toBe(3000);
    });

    it('should update home cooking data', () => {
      const { result } = renderHook(() => useCalculator(), { wrapper });

      act(() => {
        result.current.updateHomeCooking({
          monthlyGroceryCost: 100000,
          cookingHoursPerWeek: 10,
        });
      });

      expect(result.current.mealCostData.homeCooking.monthlyGroceryCost).toBe(
        100000
      );
      expect(result.current.mealCostData.homeCooking.cookingHoursPerWeek).toBe(
        10
      );
    });

    it('should update entire meal cost data object', () => {
      const { result } = renderHook(() => useCalculator(), { wrapper });

      const newEatingOut: EatingOutData = {
        breakfastCount: 7,
        lunchCount: 7,
        dinnerCount: 7,
        coffeeCount: 10,
        fastFoodCount: 0,
        breakfastCost: 1500,
        lunchCost: 2500,
        dinnerCost: 4000,
        coffeeCost: 650,
        fastFoodCost: 2000,
      };

      const newHomeCooking: HomeCookingData = {
        monthlyGroceryCost: 10000,
        householdSize: 1,
        shoppingHoursPerWeek: 0.5,
        cookingHoursPerWeek: 0,
      };

      act(() => {
        result.current.updateMealCostData({
          eatingOut: newEatingOut,
          homeCooking: newHomeCooking,
        });
      });

      expect(result.current.mealCostData.eatingOut).toEqual(newEatingOut);
      expect(result.current.mealCostData.homeCooking).toEqual(newHomeCooking);
    });
  });

  describe('Meal Cost Summary', () => {
    it('should calculate meal cost summary', () => {
      const { result } = renderHook(() => useCalculator(), { wrapper });

      // Set up income to get actualHourlyWage
      act(() => {
        result.current.updateIncome({
          grossAnnualIncome: 6000000, // 6M ISK
          additionalIncome: 0,
          hoursPerWeek: 40,
          weeksPerYear: 50,
        });
      });

      expect(result.current.mealCostSummary).toBeDefined();
      expect(result.current.mealCostSummary?.eatingOutSummary).toBeDefined();
      expect(
        result.current.mealCostSummary?.homeCookingSummary
      ).toBeDefined();
      expect(result.current.mealCostSummary?.cheaperOption).toBeDefined();
    });

    it('should recalculate when meal cost data changes', () => {
      const { result } = renderHook(() => useCalculator(), { wrapper });

      // Set up income
      act(() => {
        result.current.updateIncome({
          grossAnnualIncome: 6000000,
          additionalIncome: 0,
          hoursPerWeek: 40,
          weeksPerYear: 50,
        });
      });

      const initialSummary = result.current.mealCostSummary;

      // Update eating out costs
      act(() => {
        result.current.updateEatingOut({ lunchCount: 0, dinnerCount: 0 });
      });

      const updatedSummary = result.current.mealCostSummary;

      // Summary should be different after update
      expect(updatedSummary?.eatingOutSummary.monthlyCost).not.toBe(
        initialSummary?.eatingOutSummary.monthlyCost
      );
    });

    it('should handle zero wage gracefully', () => {
      const { result } = renderHook(() => useCalculator(), { wrapper });

      // Don't set income (wage will be 0)
      expect(result.current.results?.actualHourlyWage).toBeUndefined();

      // Should still calculate summary (costs will work, life energy will be 0)
      expect(result.current.mealCostSummary).toBeDefined();
      expect(
        result.current.mealCostSummary?.eatingOutSummary.monthlyCost
      ).toBeGreaterThan(0);
    });
  });

  describe('localStorage Persistence', () => {
    it('should include mealCostData in storage state', async () => {
      const { result } = renderHook(() => useCalculator(), { wrapper });

      await act(async () => {
        result.current.updateEatingOut({ lunchCount: 7 });
        result.current.updateHomeCooking({ monthlyGroceryCost: 90000 });
      });

      // Save to storage explicitly (no need to wait for debounce)
      await act(async () => {
        result.current.saveToStorage();
      });

      // Check localStorage contains mealCostData
      const stored = localStorage.getItem('actual-hourly-wage-calculator');
      expect(stored).toBeTruthy();

      if (stored) {
        const data = JSON.parse(stored);
        expect(data.mealCostData).toBeDefined();
        expect(data.mealCostData.eatingOut.lunchCount).toBe(7);
        expect(data.mealCostData.homeCooking.monthlyGroceryCost).toBe(90000);
      }
    });
  });

  describe('Reset Functionality', () => {
    it('should reset meal cost data to defaults', () => {
      const { result } = renderHook(() => useCalculator(), { wrapper });

      // Make some changes
      act(() => {
        result.current.updateEatingOut({ lunchCount: 7, dinnerCount: 7 });
        result.current.updateHomeCooking({ monthlyGroceryCost: 120000 });
      });

      // Reset
      act(() => {
        result.current.resetAll();
      });

      // Should be back to defaults
      expect(result.current.mealCostData.eatingOut.lunchCount).toBe(5);
      expect(result.current.mealCostData.eatingOut.dinnerCount).toBe(2);
      expect(result.current.mealCostData.homeCooking.monthlyGroceryCost).toBe(
        80000
      );
    });
  });
});
