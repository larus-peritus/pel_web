/**
 * FIRE Type Explorer - Integration Tests
 *
 * Tests the full integration of FIRE Type Explorer with CalculatorContext,
 * localStorage persistence, and data flow between components.
 *
 * Epic 9, Task 9.6
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import { CalculatorProvider, useCalculator } from '@/context/CalculatorContext';
import type { FIRETypePreferences, UserFinancialInputs, FIREAssumptions } from '@/types/fireTypes';
import { DEFAULT_FIRE_ASSUMPTIONS } from '@/types/fireTypes';
import type { ExpenseBaseline } from '@/types/calculator';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('FIRE Type Explorer Integration', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <CalculatorProvider>{children}</CalculatorProvider>
  );

  describe('Context State Management', () => {
    it('should initialize with no FIRE type preferences', () => {
      const { result } = renderHook(() => useCalculator(), { wrapper });

      expect(result.current.fireTypePreferences).toBeNull();
    });

    it('should update FIRE type preferences correctly', () => {
      const { result } = renderHook(() => useCalculator(), { wrapper });

      const newPreferences: FIRETypePreferences = {
        selectedType: 'regularfire',
        selectedTier: 'comfortable',
        showAllTypes: true,
        expandedSections: ['recommendations'],
        customAssumptions: undefined,
        userInputs: {
          currentAge: 30,
          currentNetWorth: 5000000,
          monthlyGrossIncome: 600000,
          monthlySavings: 150000,
          targetRetirementAge: 60,
        },
      };

      act(() => {
        result.current.updateFIRETypePreferences(newPreferences);
      });

      expect(result.current.fireTypePreferences).toEqual(newPreferences);
    });

    it('should update selected FIRE type', () => {
      const { result } = renderHook(() => useCalculator(), { wrapper });

      act(() => {
        result.current.updateFIRETypePreferences({
          selectedType: 'leanfire',
        });
      });

      expect(result.current.fireTypePreferences?.selectedType).toBe('leanfire');

      act(() => {
        result.current.updateFIRETypePreferences({
          selectedType: 'fatfire',
        });
      });

      expect(result.current.fireTypePreferences?.selectedType).toBe('fatfire');
    });

    it('should update custom assumptions', () => {
      const { result } = renderHook(() => useCalculator(), { wrapper });

      const customAssumptions: FIREAssumptions = {
        withdrawalRate: 0.035,
        annualGrowthRate: 0.07,
        annualInflationRate: 0.04,
        pensionAge: 67,
      };

      act(() => {
        result.current.updateFIRETypePreferences({
          customAssumptions,
        });
      });

      expect(result.current.fireTypePreferences?.customAssumptions).toEqual(customAssumptions);
    });

    it('should update user financial inputs', () => {
      const { result } = renderHook(() => useCalculator(), { wrapper });

      const userInputs: UserFinancialInputs = {
        currentAge: 35,
        currentNetWorth: 10000000,
        monthlyGrossIncome: 800000,
        monthlySavings: 300000,
        targetRetirementAge: 55,
      };

      act(() => {
        result.current.updateFIRETypePreferences({
          userInputs,
        });
      });

      expect(result.current.fireTypePreferences?.userInputs).toEqual(userInputs);
    });
  });

  describe('LocalStorage Persistence', () => {
    it('should persist FIRE type preferences to localStorage', async () => {
      const { result } = renderHook(() => useCalculator(), { wrapper });

      const preferences: FIRETypePreferences = {
        selectedType: 'coastfire',
        selectedTier: 'deluxe',
        showAllTypes: true,
        expandedSections: [],
        customAssumptions: {
          withdrawalRate: 0.03,
          annualGrowthRate: 0.06,
          annualInflationRate: 0.035,
          pensionAge: 67,
        },
        userInputs: {
          currentAge: 28,
          currentNetWorth: 3000000,
          monthlyGrossIncome: 500000,
          monthlySavings: 120000,
          targetRetirementAge: 50,
        },
      };

      act(() => {
        result.current.updateFIRETypePreferences(preferences);
      });

      // Wait for debounced save
      await waitFor(
        () => {
          const stored = localStorageMock.getItem('calculator_state');
          expect(stored).toBeTruthy();
          if (stored) {
            const parsed = JSON.parse(stored);
            expect(parsed.fireTypePreferences).toEqual(preferences);
          }
        },
        { timeout: 1000 }
      );
    });

    it('should load FIRE type preferences from localStorage on mount', () => {
      const preferences: FIRETypePreferences = {
        selectedType: 'baristafire',
        selectedTier: 'barebones',
        showAllTypes: false,
        expandedSections: ['timeline'],
        customAssumptions: DEFAULT_FIRE_ASSUMPTIONS,
        userInputs: {
          currentAge: 40,
          currentNetWorth: 15000000,
          monthlyGrossIncome: 900000,
          monthlySavings: 250000,
          targetRetirementAge: 65,
        },
      };

      localStorageMock.setItem(
        'calculator_state',
        JSON.stringify({ fireTypePreferences: preferences })
      );

      const { result } = renderHook(() => useCalculator(), { wrapper });

      expect(result.current.fireTypePreferences).toEqual(preferences);
    });
  });

  describe('Calculation Triggers', () => {
    it('should trigger calculations when inputs change', () => {
      const { result } = renderHook(() => useCalculator(), { wrapper });

      // Set up expense baseline
      const expenseBaseline: ExpenseBaseline = {
        monthlyExpenses: {
          barebones: 300000,
          comfortable: 500000,
          deluxe: 800000,
        },
        categoryBreakdowns: {
          barebones: {},
          comfortable: {},
          deluxe: {},
        },
        annualExpenses: {
          barebones: 3600000,
          comfortable: 6000000,
          deluxe: 9600000,
        },
        lifestyleDescription: {
          barebones: 'Lágmarks',
          comfortable: 'Þægilegt',
          deluxe: 'Lúxus',
        },
      };

      act(() => {
        result.current.updateExpenseBaseline(expenseBaseline);
      });

      // Set user inputs
      const userInputs: UserFinancialInputs = {
        currentAge: 30,
        currentNetWorth: 5000000,
        monthlyGrossIncome: 700000,
        monthlySavings: 200000,
        targetRetirementAge: 55,
      };

      act(() => {
        result.current.updateFIRETypePreferences({
          userInputs,
          selectedTier: 'comfortable',
        });
      });

      // Verify state updated
      expect(result.current.expenseBaseline).toEqual(expenseBaseline);
      expect(result.current.fireTypePreferences?.userInputs).toEqual(userInputs);
    });
  });

  describe('Expense Baseline Integration', () => {
    it('should integrate with expense baseline data', () => {
      const { result } = renderHook(() => useCalculator(), { wrapper });

      const expenseBaseline: ExpenseBaseline = {
        monthlyExpenses: {
          barebones: 250000,
          comfortable: 450000,
          deluxe: 700000,
        },
        categoryBreakdowns: {
          barebones: {},
          comfortable: {},
          deluxe: {},
        },
        annualExpenses: {
          barebones: 3000000,
          comfortable: 5400000,
          deluxe: 8400000,
        },
        lifestyleDescription: {
          barebones: 'Lágmarks lífsstíll',
          comfortable: 'Þægilegur lífsstíll',
          deluxe: 'Lúxus lífsstíll',
        },
      };

      act(() => {
        result.current.updateExpenseBaseline(expenseBaseline);
      });

      expect(result.current.expenseBaseline).toEqual(expenseBaseline);
    });

    it('should handle missing expense baseline gracefully', () => {
      const { result } = renderHook(() => useCalculator(), { wrapper });

      expect(result.current.expenseBaseline).toBeNull();

      // Should still allow setting user inputs
      const userInputs: UserFinancialInputs = {
        currentAge: 25,
        currentNetWorth: 1000000,
        monthlyGrossIncome: 400000,
        monthlySavings: 80000,
        targetRetirementAge: 60,
      };

      act(() => {
        result.current.updateFIRETypePreferences({
          userInputs,
        });
      });

      expect(result.current.fireTypePreferences?.userInputs).toEqual(userInputs);
    });
  });

  describe('Export/Import Integration', () => {
    it('should include FIRE type preferences in export', () => {
      const { result } = renderHook(() => useCalculator(), { wrapper });

      const preferences: FIRETypePreferences = {
        selectedType: 'regularfire',
        selectedTier: 'comfortable',
        showAllTypes: true,
        expandedSections: [],
        customAssumptions: undefined,
        userInputs: {
          currentAge: 32,
          currentNetWorth: 8000000,
          monthlyGrossIncome: 750000,
          monthlySavings: 225000,
          targetRetirementAge: 58,
        },
      };

      act(() => {
        result.current.updateFIRETypePreferences(preferences);
      });

      const exportedData = result.current.exportData();

      expect(exportedData.fireTypePreferences).toEqual(preferences);
    });

    it('should restore FIRE type preferences on import', () => {
      const { result } = renderHook(() => useCalculator(), { wrapper });

      const preferences: FIRETypePreferences = {
        selectedType: 'fatfire',
        selectedTier: 'deluxe',
        showAllTypes: false,
        expandedSections: ['educational'],
        customAssumptions: {
          withdrawalRate: 0.025,
          annualGrowthRate: 0.08,
          annualInflationRate: 0.03,
          pensionAge: 67,
        },
        userInputs: {
          currentAge: 45,
          currentNetWorth: 50000000,
          monthlyGrossIncome: 2000000,
          monthlySavings: 800000,
          targetRetirementAge: 55,
        },
      };

      const importData = {
        fireTypePreferences: preferences,
        version: '1.0',
        exportDate: new Date().toISOString(),
      };

      act(() => {
        result.current.importData(importData);
      });

      expect(result.current.fireTypePreferences).toEqual(preferences);
    });
  });

  describe('Tier Selection', () => {
    it('should allow changing expense tier', () => {
      const { result } = renderHook(() => useCalculator(), { wrapper });

      act(() => {
        result.current.updateFIRETypePreferences({
          selectedTier: 'barebones',
        });
      });

      expect(result.current.fireTypePreferences?.selectedTier).toBe('barebones');

      act(() => {
        result.current.updateFIRETypePreferences({
          selectedTier: 'comfortable',
        });
      });

      expect(result.current.fireTypePreferences?.selectedTier).toBe('comfortable');

      act(() => {
        result.current.updateFIRETypePreferences({
          selectedTier: 'deluxe',
        });
      });

      expect(result.current.fireTypePreferences?.selectedTier).toBe('deluxe');
    });
  });

  describe('Reset Functionality', () => {
    it('should reset FIRE type preferences', () => {
      const { result } = renderHook(() => useCalculator(), { wrapper });

      // Set some preferences
      act(() => {
        result.current.updateFIRETypePreferences({
          selectedType: 'leanfire',
          userInputs: {
            currentAge: 30,
            currentNetWorth: 5000000,
            monthlyGrossIncome: 600000,
            monthlySavings: 150000,
            targetRetirementAge: 60,
          },
        });
      });

      expect(result.current.fireTypePreferences).toBeTruthy();

      // Reset
      act(() => {
        result.current.resetData();
      });

      expect(result.current.fireTypePreferences).toBeNull();
    });
  });
});
