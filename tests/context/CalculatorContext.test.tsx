import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import {
  CalculatorProvider,
  useCalculator,
} from '@/context/CalculatorContext';
import type { CalculatorInputs, Preset } from '@/types/calculator';
import { DEFAULT_INPUTS } from '@/lib/defaults';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
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

describe('CalculatorContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Provider Initialization', () => {
    it('should initialize with default inputs', () => {
      const { result } = renderHook(() => useCalculator(), {
        wrapper: CalculatorProvider,
      });

      expect(result.current.inputs).toEqual(DEFAULT_INPUTS);
      expect(result.current.scenarios).toEqual([]);
      expect(result.current.results).toBeNull();
    });

    it('should load from localStorage if available', () => {
      const storedInputs: CalculatorInputs = {
        income: {
          grossAnnualIncome: 75000,
          workHoursPerWeek: 40,
          vacationDays: 10,
          additionalIncome: 5000,
        },
        moneyExpenses: {
          commute: 5000,
          clothing: 1000,
          meals: 2000,
          decompression: 500,
          childcareDelta: 0,
          other: 1000,
        },
        timeExpenses: {
          commute: 10,
          gettingReady: 5,
          decompression: 3,
          workIllness: 0.5,
        },
      };

      localStorage.setItem(
        'actual-hourly-wage-calculator',
        JSON.stringify({
          version: 1,
          currentInputs: storedInputs,
          scenarios: [],
          lastUpdated: new Date().toISOString(),
        })
      );

      const { result } = renderHook(() => useCalculator(), {
        wrapper: CalculatorProvider,
      });

      expect(result.current.inputs).toEqual(storedInputs);
    });

    it('should set isHydrated to true after loading', () => {
      const { result } = renderHook(() => useCalculator(), {
        wrapper: CalculatorProvider,
      });

      // isHydrated is set synchronously in the first useEffect
      expect(result.current.isHydrated).toBe(true);
    });
  });

  describe('Input Updates', () => {
    it('should update income', () => {
      const { result } = renderHook(() => useCalculator(), {
        wrapper: CalculatorProvider,
      });

      act(() => {
        result.current.updateIncome({
          grossAnnualIncome: 60000,
        });
      });

      expect(result.current.inputs.income.grossAnnualIncome).toBe(60000);
    });

    it('should update money expenses', () => {
      const { result } = renderHook(() => useCalculator(), {
        wrapper: CalculatorProvider,
      });

      act(() => {
        result.current.updateMoneyExpenses({
          commute: 3000,
          meals: 1500,
        });
      });

      expect(result.current.inputs.moneyExpenses.commute).toBe(3000);
      expect(result.current.inputs.moneyExpenses.meals).toBe(1500);
    });

    it('should update time expenses', () => {
      const { result } = renderHook(() => useCalculator(), {
        wrapper: CalculatorProvider,
      });

      act(() => {
        result.current.updateTimeExpenses({
          commute: 10,
          gettingReady: 5,
        });
      });

      expect(result.current.inputs.timeExpenses.commute).toBe(10);
      expect(result.current.inputs.timeExpenses.gettingReady).toBe(5);
    });

    it('should set complete inputs', () => {
      const { result } = renderHook(() => useCalculator(), {
        wrapper: CalculatorProvider,
      });

      const newInputs: CalculatorInputs = {
        income: {
          grossAnnualIncome: 80000,
          workHoursPerWeek: 45,
          vacationDays: 20,
          additionalIncome: 2000,
        },
        moneyExpenses: {
          commute: 4000,
          clothing: 1200,
          meals: 2400,
          decompression: 600,
          childcareDelta: 1000,
          other: 500,
        },
        timeExpenses: {
          commute: 12,
          gettingReady: 6,
          decompression: 4,
          workIllness: 1,
        },
      };

      act(() => {
        result.current.setInputs(newInputs);
      });

      expect(result.current.inputs).toEqual(newInputs);
    });
  });

  describe('Calculation Results', () => {
    it('should return null results when income is zero', () => {
      const { result } = renderHook(() => useCalculator(), {
        wrapper: CalculatorProvider,
      });

      expect(result.current.results).toBeNull();
    });

    it('should calculate results when income is set', () => {
      const { result } = renderHook(() => useCalculator(), {
        wrapper: CalculatorProvider,
      });

      act(() => {
        result.current.updateIncome({
          grossAnnualIncome: 50000,
        });
      });

      expect(result.current.results).not.toBeNull();
      expect(result.current.results?.nominalHourlyWage).toBe(25);
      expect(result.current.results?.actualHourlyWage).toBe(25);
    });

    it('should recalculate when inputs change', () => {
      const { result } = renderHook(() => useCalculator(), {
        wrapper: CalculatorProvider,
      });

      act(() => {
        result.current.updateIncome({
          grossAnnualIncome: 50000,
        });
      });

      const firstResult = result.current.results?.actualHourlyWage;

      act(() => {
        result.current.updateMoneyExpenses({
          commute: 5000,
        });
      });

      const secondResult = result.current.results?.actualHourlyWage;

      expect(secondResult).not.toBe(firstResult);
      expect(secondResult).toBeLessThan(firstResult!);
    });
  });

  describe('Scenario Management', () => {
    it('should save current state as scenario', () => {
      const { result } = renderHook(() => useCalculator(), {
        wrapper: CalculatorProvider,
      });

      act(() => {
        result.current.updateIncome({ grossAnnualIncome: 50000 });
      });

      act(() => {
        result.current.saveCurrentAsScenario('Test Scenario');
      });

      expect(result.current.scenarios).toHaveLength(1);
      expect(result.current.scenarios[0].name).toBe('Test Scenario');
      expect(result.current.scenarios[0].inputs.income.grossAnnualIncome).toBe(
        50000
      );
    });

    it('should not save scenario if results are null', () => {
      const { result } = renderHook(() => useCalculator(), {
        wrapper: CalculatorProvider,
      });

      act(() => {
        result.current.saveCurrentAsScenario('Test Scenario');
      });

      expect(result.current.scenarios).toHaveLength(0);
    });

    it('should enforce maximum of 3 scenarios', () => {
      const { result } = renderHook(() => useCalculator(), {
        wrapper: CalculatorProvider,
      });

      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      act(() => {
        result.current.updateIncome({ grossAnnualIncome: 50000 });
      });

      // Save 3 scenarios
      act(() => {
        result.current.saveCurrentAsScenario('Scenario 1');
        result.current.saveCurrentAsScenario('Scenario 2');
        result.current.saveCurrentAsScenario('Scenario 3');
      });

      expect(result.current.scenarios).toHaveLength(3);

      // Try to save a 4th
      act(() => {
        result.current.saveCurrentAsScenario('Scenario 4');
      });

      expect(result.current.scenarios).toHaveLength(3);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Maximum 3 scenarios allowed'
      );

      consoleWarnSpy.mockRestore();
    });

    it('should load scenario', () => {
      const { result } = renderHook(() => useCalculator(), {
        wrapper: CalculatorProvider,
      });

      act(() => {
        result.current.updateIncome({ grossAnnualIncome: 50000 });
      });

      act(() => {
        result.current.saveCurrentAsScenario('Scenario 1');
      });

      const scenarioId = result.current.scenarios[0]?.id;

      act(() => {
        result.current.updateIncome({ grossAnnualIncome: 60000 });
      });

      expect(result.current.inputs.income.grossAnnualIncome).toBe(60000);

      act(() => {
        result.current.loadScenario(scenarioId);
      });

      expect(result.current.inputs.income.grossAnnualIncome).toBe(50000);
    });

    it('should delete scenario', () => {
      const { result } = renderHook(() => useCalculator(), {
        wrapper: CalculatorProvider,
      });

      act(() => {
        result.current.updateIncome({ grossAnnualIncome: 50000 });
      });

      act(() => {
        result.current.saveCurrentAsScenario('Scenario 1');
      });

      const scenarioId = result.current.scenarios[0]?.id;

      act(() => {
        result.current.deleteScenario(scenarioId);
      });

      expect(result.current.scenarios).toHaveLength(0);
    });
  });

  describe('Persistence', () => {
    it('should auto-save to localStorage after debounce', async () => {
      const { result } = renderHook(() => useCalculator(), {
        wrapper: CalculatorProvider,
      });

      act(() => {
        result.current.updateIncome({ grossAnnualIncome: 50000 });
      });

      // Wait for debounced save (500ms)
      await new Promise((resolve) => setTimeout(resolve, 600));

      const stored = JSON.parse(
        localStorage.getItem('actual-hourly-wage-calculator') || '{}'
      );
      expect(stored.currentInputs.income.grossAnnualIncome).toBe(50000);
    });

    it('should save to storage manually', () => {
      const { result } = renderHook(() => useCalculator(), {
        wrapper: CalculatorProvider,
      });

      act(() => {
        result.current.updateIncome({ grossAnnualIncome: 75000 });
      });

      act(() => {
        result.current.saveToStorage();
      });

      const stored = JSON.parse(
        localStorage.getItem('actual-hourly-wage-calculator') || '{}'
      );
      expect(stored.currentInputs.income.grossAnnualIncome).toBe(75000);
    });

    it('should load from storage manually', () => {
      localStorage.setItem(
        'actual-hourly-wage-calculator',
        JSON.stringify({
          version: 1,
          currentInputs: {
            ...DEFAULT_INPUTS,
            income: { ...DEFAULT_INPUTS.income, grossAnnualIncome: 90000 },
          },
          scenarios: [],
          lastUpdated: new Date().toISOString(),
        })
      );

      const { result } = renderHook(() => useCalculator(), {
        wrapper: CalculatorProvider,
      });

      act(() => {
        result.current.loadFromStorage();
      });

      expect(result.current.inputs.income.grossAnnualIncome).toBe(90000);
    });

    it('should reset all data', () => {
      const { result } = renderHook(() => useCalculator(), {
        wrapper: CalculatorProvider,
      });

      act(() => {
        result.current.updateIncome({ grossAnnualIncome: 50000 });
        result.current.saveCurrentAsScenario('Test');
      });

      act(() => {
        result.current.resetAll();
      });

      expect(result.current.inputs).toEqual(DEFAULT_INPUTS);
      expect(result.current.scenarios).toEqual([]);
    });
  });

  describe('Preset Application', () => {
    it('should apply commute preset', () => {
      const { result } = renderHook(() => useCalculator(), {
        wrapper: CalculatorProvider,
      });

      const preset: Preset = {
        id: 'commute-moderate',
        category: 'commute',
        label: 'Moderate',
        description: 'Moderate commute',
        values: {
          commute: 3000,
        },
      };

      act(() => {
        result.current.applyPreset(preset);
      });

      expect(result.current.inputs.moneyExpenses.commute).toBe(3000);
    });

    it('should apply clothing preset', () => {
      const { result } = renderHook(() => useCalculator(), {
        wrapper: CalculatorProvider,
      });

      const preset: Preset = {
        id: 'clothing-professional',
        category: 'clothing',
        label: 'Professional',
        description: 'Professional attire',
        values: {
          clothing: 2000,
        },
      };

      act(() => {
        result.current.applyPreset(preset);
      });

      expect(result.current.inputs.moneyExpenses.clothing).toBe(2000);
    });

    it('should apply meals preset', () => {
      const { result } = renderHook(() => useCalculator(), {
        wrapper: CalculatorProvider,
      });

      const preset: Preset = {
        id: 'meals-daily',
        category: 'meals',
        label: 'Daily',
        description: 'Buy meals daily',
        values: {
          meals: 2500,
        },
      };

      act(() => {
        result.current.applyPreset(preset);
      });

      expect(result.current.inputs.moneyExpenses.meals).toBe(2500);
    });
  });

  describe('Export/Import', () => {
    it('should export data', () => {
      const { result } = renderHook(() => useCalculator(), {
        wrapper: CalculatorProvider,
      });

      // Mock URL.createObjectURL (not available in jsdom)
      global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
      global.URL.revokeObjectURL = vi.fn();

      // Mock DOM methods
      const createElementSpy = vi.spyOn(document, 'createElement');
      const mockAnchor = {
        href: '',
        download: '',
        click: vi.fn(),
      };
      createElementSpy.mockReturnValue(mockAnchor as any);

      act(() => {
        result.current.updateIncome({ grossAnnualIncome: 50000 });
        result.current.exportData();
      });

      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(mockAnchor.click).toHaveBeenCalled();
      expect(mockAnchor.download).toContain('life-energy-calculator');
      expect(global.URL.revokeObjectURL).toHaveBeenCalled();

      createElementSpy.mockRestore();
    });

    it('should import valid data', async () => {
      const { result } = renderHook(() => useCalculator(), {
        wrapper: CalculatorProvider,
      });

      const mockFile = new File(
        [
          JSON.stringify({
            version: 1,
            currentInputs: {
              ...DEFAULT_INPUTS,
              income: { ...DEFAULT_INPUTS.income, grossAnnualIncome: 65000 },
            },
            scenarios: [],
            lastUpdated: new Date().toISOString(),
          }),
        ],
        'test.json',
        { type: 'application/json' }
      );

      await act(async () => {
        await result.current.importData(mockFile);
      });

      await waitFor(() => {
        expect(result.current.inputs.income.grossAnnualIncome).toBe(65000);
      });
    });

    it('should reject invalid JSON', async () => {
      const { result } = renderHook(() => useCalculator(), {
        wrapper: CalculatorProvider,
      });

      const mockFile = new File(['invalid json'], 'test.json', {
        type: 'application/json',
      });

      let error: Error | undefined;
      try {
        await act(async () => {
          await result.current.importData(mockFile);
        });
      } catch (e) {
        error = e as Error;
      }

      expect(error).toBeDefined();
      expect(error?.message).toContain('Failed to parse file');
    });

    it('should reject incompatible version', async () => {
      const { result } = renderHook(() => useCalculator(), {
        wrapper: CalculatorProvider,
      });

      const mockFile = new File(
        [
          JSON.stringify({
            version: 999,
            currentInputs: DEFAULT_INPUTS,
            scenarios: [],
            lastUpdated: new Date().toISOString(),
          }),
        ],
        'test.json',
        { type: 'application/json' }
      );

      let error: Error | undefined;
      try {
        await act(async () => {
          await result.current.importData(mockFile);
        });
      } catch (e) {
        error = e as Error;
      }

      expect(error).toBeDefined();
      expect(error?.message).toContain('Incompatible file version');
    });
  });

  describe('Hook Error Handling', () => {
    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      try {
        renderHook(() => useCalculator());
        // If we get here, the test should fail
        expect.fail('Expected hook to throw error');
      } catch (error) {
        // This is expected - the hook should throw
        expect((error as Error).message).toContain(
          'useCalculator must be used within a CalculatorProvider'
        );
      }

      consoleErrorSpy.mockRestore();
    });
  });
});
