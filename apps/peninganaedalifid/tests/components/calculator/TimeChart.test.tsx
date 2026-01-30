import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TimeChart } from '@/components/calculator/TimeChart';
import { useCalculator } from '@/context/CalculatorContext';
import type { CalculationResults } from '@/types/calculator';

// Mock the CalculatorContext
vi.mock('@/context/CalculatorContext', () => ({
  useCalculator: vi.fn(),
}));

describe('TimeChart', () => {
  const mockUseCalculator = useCalculator as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render nothing when results is null', () => {
      mockUseCalculator.mockReturnValue({
        results: null,
        inputs: {},
        setInputs: vi.fn(),
        updateIncome: vi.fn(),
        updateMoneyExpenses: vi.fn(),
        updateTimeExpenses: vi.fn(),
        scenarios: [],
        saveCurrentAsScenario: vi.fn(),
        deleteScenario: vi.fn(),
        loadScenario: vi.fn(),
        saveToStorage: vi.fn(),
        loadFromStorage: vi.fn(),
        exportData: vi.fn(),
        importData: vi.fn(),
        resetAll: vi.fn(),
        applyPreset: vi.fn(),
        isHydrated: true,
      });

      const { container } = render(<TimeChart />);
      expect(container.firstChild).toBeNull();
    });

    it('should render nothing when timeBreakdown is empty', () => {
      mockUseCalculator.mockReturnValue({
        results: {
          timeBreakdown: [],
          totalWeeklyHours: 0,
          nominalWage: { weeksPerYear: 50 },
        } as unknown as CalculationResults,
        inputs: {},
        setInputs: vi.fn(),
        updateIncome: vi.fn(),
        updateMoneyExpenses: vi.fn(),
        updateTimeExpenses: vi.fn(),
        scenarios: [],
        saveCurrentAsScenario: vi.fn(),
        deleteScenario: vi.fn(),
        loadScenario: vi.fn(),
        saveToStorage: vi.fn(),
        loadFromStorage: vi.fn(),
        exportData: vi.fn(),
        importData: vi.fn(),
        resetAll: vi.fn(),
        applyPreset: vi.fn(),
        isHydrated: true,
      });

      const { container } = render(<TimeChart />);
      expect(container.firstChild).toBeNull();
    });

    it('should render chart with time breakdown data', () => {
      const mockResults: Partial<CalculationResults> = {
        timeBreakdown: [
          {
            category: 'work',
            label: 'Base Work Hours',
            hoursPerWeek: 40,
            hoursPerYear: 2000,
            percentage: 80,
          },
          {
            category: 'commute',
            label: 'Commute',
            hoursPerWeek: 5,
            hoursPerYear: 250,
            percentage: 10,
          },
          {
            category: 'ready',
            label: 'Getting Ready',
            hoursPerWeek: 5,
            hoursPerYear: 250,
            percentage: 10,
          },
        ],
        totalWeeklyHours: 50,
        nominalWage: {
          weeksPerYear: 50,
        },
      } as CalculationResults;

      mockUseCalculator.mockReturnValue({
        results: mockResults as CalculationResults,
        inputs: {},
        setInputs: vi.fn(),
        updateIncome: vi.fn(),
        updateMoneyExpenses: vi.fn(),
        updateTimeExpenses: vi.fn(),
        scenarios: [],
        saveCurrentAsScenario: vi.fn(),
        deleteScenario: vi.fn(),
        loadScenario: vi.fn(),
        saveToStorage: vi.fn(),
        loadFromStorage: vi.fn(),
        exportData: vi.fn(),
        importData: vi.fn(),
        resetAll: vi.fn(),
        applyPreset: vi.fn(),
        isHydrated: true,
      });

      render(<TimeChart />);

      // Check header
      expect(screen.getByText('Time Allocation')).toBeInTheDocument();
      expect(screen.getByText('Your weekly hours devoted to work')).toBeInTheDocument();

      // Check center total
      expect(screen.getByText('50.0')).toBeInTheDocument();
      expect(screen.getByText('hrs/week')).toBeInTheDocument();

      // Check legend items
      expect(screen.getByText('Base Work Hours')).toBeInTheDocument();
      expect(screen.getByText('40.0 hrs (80.0%)')).toBeInTheDocument();
      expect(screen.getByText('Commute')).toBeInTheDocument();
      expect(screen.getByText('Getting Ready')).toBeInTheDocument();
      // Both Commute and Getting Ready have the same hours/percentage, so use getAllByText
      const fiveHourTexts = screen.getAllByText('5.0 hrs (10.0%)');
      expect(fiveHourTexts).toHaveLength(2);

      // Check total annotation
      expect(screen.getByText(/Total work-related time:/)).toBeInTheDocument();
      expect(screen.getByText(/50.0 hours per week/)).toBeInTheDocument();
      expect(screen.getByText(/\(2500 hours per year\)/)).toBeInTheDocument();
    });

    it('should render all five time categories when provided', () => {
      const mockResults: Partial<CalculationResults> = {
        timeBreakdown: [
          {
            category: 'work',
            label: 'Base Work Hours',
            hoursPerWeek: 40,
            hoursPerYear: 2000,
            percentage: 66.67,
          },
          {
            category: 'commute',
            label: 'Commute',
            hoursPerWeek: 10,
            hoursPerYear: 500,
            percentage: 16.67,
          },
          {
            category: 'ready',
            label: 'Getting Ready',
            hoursPerWeek: 5,
            hoursPerYear: 250,
            percentage: 8.33,
          },
          {
            category: 'decompression',
            label: 'Decompression',
            hoursPerWeek: 3,
            hoursPerYear: 150,
            percentage: 5,
          },
          {
            category: 'illness',
            label: 'Work Illness',
            hoursPerWeek: 2,
            hoursPerYear: 100,
            percentage: 3.33,
          },
        ],
        totalWeeklyHours: 60,
        nominalWage: {
          weeksPerYear: 50,
        },
      } as CalculationResults;

      mockUseCalculator.mockReturnValue({
        results: mockResults as CalculationResults,
        inputs: {},
        setInputs: vi.fn(),
        updateIncome: vi.fn(),
        updateMoneyExpenses: vi.fn(),
        updateTimeExpenses: vi.fn(),
        scenarios: [],
        saveCurrentAsScenario: vi.fn(),
        deleteScenario: vi.fn(),
        loadScenario: vi.fn(),
        saveToStorage: vi.fn(),
        loadFromStorage: vi.fn(),
        exportData: vi.fn(),
        importData: vi.fn(),
        resetAll: vi.fn(),
        applyPreset: vi.fn(),
        isHydrated: true,
      });

      render(<TimeChart />);

      // Check all categories are present
      expect(screen.getByText('Base Work Hours')).toBeInTheDocument();
      expect(screen.getByText('Commute')).toBeInTheDocument();
      expect(screen.getByText('Getting Ready')).toBeInTheDocument();
      expect(screen.getByText('Decompression')).toBeInTheDocument();
      expect(screen.getByText('Work Illness')).toBeInTheDocument();

      // Check center total
      expect(screen.getByText('60.0')).toBeInTheDocument();
    });
  });

  describe('Formatting', () => {
    it('should format hours to 1 decimal place', () => {
      const mockResults: Partial<CalculationResults> = {
        timeBreakdown: [
          {
            category: 'work',
            label: 'Base Work Hours',
            hoursPerWeek: 37.5,
            hoursPerYear: 1875,
            percentage: 100,
          },
        ],
        totalWeeklyHours: 37.5,
        nominalWage: {
          weeksPerYear: 50,
        },
      } as CalculationResults;

      mockUseCalculator.mockReturnValue({
        results: mockResults as CalculationResults,
        inputs: {},
        setInputs: vi.fn(),
        updateIncome: vi.fn(),
        updateMoneyExpenses: vi.fn(),
        updateTimeExpenses: vi.fn(),
        scenarios: [],
        saveCurrentAsScenario: vi.fn(),
        deleteScenario: vi.fn(),
        loadScenario: vi.fn(),
        saveToStorage: vi.fn(),
        loadFromStorage: vi.fn(),
        exportData: vi.fn(),
        importData: vi.fn(),
        resetAll: vi.fn(),
        applyPreset: vi.fn(),
        isHydrated: true,
      });

      render(<TimeChart />);

      expect(screen.getByText('37.5')).toBeInTheDocument();
      expect(screen.getByText('37.5 hrs (100.0%)')).toBeInTheDocument();
    });

    it('should format percentage to 1 decimal place', () => {
      const mockResults: Partial<CalculationResults> = {
        timeBreakdown: [
          {
            category: 'work',
            label: 'Base Work Hours',
            hoursPerWeek: 40,
            hoursPerYear: 2000,
            percentage: 66.67,
          },
          {
            category: 'commute',
            label: 'Commute',
            hoursPerWeek: 20,
            hoursPerYear: 1000,
            percentage: 33.33,
          },
        ],
        totalWeeklyHours: 60,
        nominalWage: {
          weeksPerYear: 50,
        },
      } as CalculationResults;

      mockUseCalculator.mockReturnValue({
        results: mockResults as CalculationResults,
        inputs: {},
        setInputs: vi.fn(),
        updateIncome: vi.fn(),
        updateMoneyExpenses: vi.fn(),
        updateTimeExpenses: vi.fn(),
        scenarios: [],
        saveCurrentAsScenario: vi.fn(),
        deleteScenario: vi.fn(),
        loadScenario: vi.fn(),
        saveToStorage: vi.fn(),
        loadFromStorage: vi.fn(),
        exportData: vi.fn(),
        importData: vi.fn(),
        resetAll: vi.fn(),
        applyPreset: vi.fn(),
        isHydrated: true,
      });

      render(<TimeChart />);

      expect(screen.getByText('40.0 hrs (66.7%)')).toBeInTheDocument();
      expect(screen.getByText('20.0 hrs (33.3%)')).toBeInTheDocument();
    });

    it('should calculate annual hours correctly', () => {
      const mockResults: Partial<CalculationResults> = {
        timeBreakdown: [
          {
            category: 'work',
            label: 'Base Work Hours',
            hoursPerWeek: 40,
            hoursPerYear: 2000,
            percentage: 100,
          },
        ],
        totalWeeklyHours: 50,
        nominalWage: {
          weeksPerYear: 48,
        },
      } as CalculationResults;

      mockUseCalculator.mockReturnValue({
        results: mockResults as CalculationResults,
        inputs: {
          income: {
            grossAnnualIncome: 50000,
            workHoursPerWeek: 40,
            vacationDays: 20,
            additionalIncome: 0,
          },
          moneyExpenses: {},
          timeExpenses: {},
        },
        setInputs: vi.fn(),
        updateIncome: vi.fn(),
        updateMoneyExpenses: vi.fn(),
        updateTimeExpenses: vi.fn(),
        scenarios: [],
        saveCurrentAsScenario: vi.fn(),
        deleteScenario: vi.fn(),
        loadScenario: vi.fn(),
        saveToStorage: vi.fn(),
        loadFromStorage: vi.fn(),
        exportData: vi.fn(),
        importData: vi.fn(),
        resetAll: vi.fn(),
        applyPreset: vi.fn(),
        isHydrated: true,
      });

      render(<TimeChart />);

      // 50 hrs/week * 48 weeks = 2400 hours/year
      expect(screen.getByText(/\(2400 hours per year\)/)).toBeInTheDocument();
    });
  });

  describe('Chart Visualization', () => {
    it('should create conic gradient with correct color mapping', () => {
      const mockResults: Partial<CalculationResults> = {
        timeBreakdown: [
          {
            category: 'work',
            label: 'Base Work Hours',
            hoursPerWeek: 40,
            hoursPerYear: 2000,
            percentage: 80,
          },
          {
            category: 'commute',
            label: 'Commute',
            hoursPerWeek: 10,
            hoursPerYear: 500,
            percentage: 20,
          },
        ],
        totalWeeklyHours: 50,
        nominalWage: {
          weeksPerYear: 50,
        },
      } as CalculationResults;

      mockUseCalculator.mockReturnValue({
        results: mockResults as CalculationResults,
        inputs: {},
        setInputs: vi.fn(),
        updateIncome: vi.fn(),
        updateMoneyExpenses: vi.fn(),
        updateTimeExpenses: vi.fn(),
        scenarios: [],
        saveCurrentAsScenario: vi.fn(),
        deleteScenario: vi.fn(),
        loadScenario: vi.fn(),
        saveToStorage: vi.fn(),
        loadFromStorage: vi.fn(),
        exportData: vi.fn(),
        importData: vi.fn(),
        resetAll: vi.fn(),
        applyPreset: vi.fn(),
        isHydrated: true,
      });

      const { container } = render(<TimeChart />);

      // Find the element with conic-gradient
      const chartElement = container.querySelector('[style*="conic-gradient"]');
      expect(chartElement).toBeInTheDocument();

      // Check that style includes color values (may be rgb() or hex)
      const style = chartElement?.getAttribute('style');
      // Browser may convert hex to rgb, so check for both formats
      expect(
        style?.includes('#0ea5e9') || style?.includes('rgb(14, 165, 233)')
      ).toBe(true); // primary-500 for work
      expect(
        style?.includes('#f59e0b') || style?.includes('rgb(245, 158, 11)')
      ).toBe(true); // warning-500 for commute
    });

    it('should handle single category (100%)', () => {
      const mockResults: Partial<CalculationResults> = {
        timeBreakdown: [
          {
            category: 'work',
            label: 'Base Work Hours',
            hoursPerWeek: 40,
            hoursPerYear: 2000,
            percentage: 100,
          },
        ],
        totalWeeklyHours: 40,
        nominalWage: {
          weeksPerYear: 50,
        },
      } as CalculationResults;

      mockUseCalculator.mockReturnValue({
        results: mockResults as CalculationResults,
        inputs: {},
        setInputs: vi.fn(),
        updateIncome: vi.fn(),
        updateMoneyExpenses: vi.fn(),
        updateTimeExpenses: vi.fn(),
        scenarios: [],
        saveCurrentAsScenario: vi.fn(),
        deleteScenario: vi.fn(),
        loadScenario: vi.fn(),
        saveToStorage: vi.fn(),
        loadFromStorage: vi.fn(),
        exportData: vi.fn(),
        importData: vi.fn(),
        resetAll: vi.fn(),
        applyPreset: vi.fn(),
        isHydrated: true,
      });

      render(<TimeChart />);

      expect(screen.getByText('40.0')).toBeInTheDocument();
      expect(screen.getByText('Base Work Hours')).toBeInTheDocument();
      expect(screen.getByText('40.0 hrs (100.0%)')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero total hours', () => {
      const mockResults: Partial<CalculationResults> = {
        timeBreakdown: [
          {
            category: 'work',
            label: 'Base Work Hours',
            hoursPerWeek: 0,
            hoursPerYear: 0,
            percentage: 0,
          },
        ],
        totalWeeklyHours: 0,
        nominalWage: {
          weeksPerYear: 50,
        },
      } as CalculationResults;

      mockUseCalculator.mockReturnValue({
        results: mockResults as CalculationResults,
        inputs: {},
        setInputs: vi.fn(),
        updateIncome: vi.fn(),
        updateMoneyExpenses: vi.fn(),
        updateTimeExpenses: vi.fn(),
        scenarios: [],
        saveCurrentAsScenario: vi.fn(),
        deleteScenario: vi.fn(),
        loadScenario: vi.fn(),
        saveToStorage: vi.fn(),
        loadFromStorage: vi.fn(),
        exportData: vi.fn(),
        importData: vi.fn(),
        resetAll: vi.fn(),
        applyPreset: vi.fn(),
        isHydrated: true,
      });

      render(<TimeChart />);

      expect(screen.getByText('0.0')).toBeInTheDocument();
      expect(screen.getByText('0.0 hrs (0.0%)')).toBeInTheDocument();
    });

    it('should handle very small hour values', () => {
      const mockResults: Partial<CalculationResults> = {
        timeBreakdown: [
          {
            category: 'work',
            label: 'Base Work Hours',
            hoursPerWeek: 0.1,
            hoursPerYear: 5,
            percentage: 100,
          },
        ],
        totalWeeklyHours: 0.1,
        nominalWage: {
          weeksPerYear: 50,
        },
      } as CalculationResults;

      mockUseCalculator.mockReturnValue({
        results: mockResults as CalculationResults,
        inputs: {},
        setInputs: vi.fn(),
        updateIncome: vi.fn(),
        updateMoneyExpenses: vi.fn(),
        updateTimeExpenses: vi.fn(),
        scenarios: [],
        saveCurrentAsScenario: vi.fn(),
        deleteScenario: vi.fn(),
        loadScenario: vi.fn(),
        saveToStorage: vi.fn(),
        loadFromStorage: vi.fn(),
        exportData: vi.fn(),
        importData: vi.fn(),
        resetAll: vi.fn(),
        applyPreset: vi.fn(),
        isHydrated: true,
      });

      render(<TimeChart />);

      expect(screen.getByText('0.1')).toBeInTheDocument();
      expect(screen.getByText('0.1 hrs (100.0%)')).toBeInTheDocument();
    });

    it('should handle very large hour values', () => {
      const mockResults: Partial<CalculationResults> = {
        timeBreakdown: [
          {
            category: 'work',
            label: 'Base Work Hours',
            hoursPerWeek: 168, // All hours in a week
            hoursPerYear: 8400,
            percentage: 100,
          },
        ],
        totalWeeklyHours: 168,
        nominalWage: {
          weeksPerYear: 50,
        },
      } as CalculationResults;

      mockUseCalculator.mockReturnValue({
        results: mockResults as CalculationResults,
        inputs: {},
        setInputs: vi.fn(),
        updateIncome: vi.fn(),
        updateMoneyExpenses: vi.fn(),
        updateTimeExpenses: vi.fn(),
        scenarios: [],
        saveCurrentAsScenario: vi.fn(),
        deleteScenario: vi.fn(),
        loadScenario: vi.fn(),
        saveToStorage: vi.fn(),
        loadFromStorage: vi.fn(),
        exportData: vi.fn(),
        importData: vi.fn(),
        resetAll: vi.fn(),
        applyPreset: vi.fn(),
        isHydrated: true,
      });

      render(<TimeChart />);

      expect(screen.getByText('168.0')).toBeInTheDocument();
      expect(screen.getByText('168.0 hrs (100.0%)')).toBeInTheDocument();
      expect(screen.getByText(/\(8400 hours per year\)/)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      const mockResults: Partial<CalculationResults> = {
        timeBreakdown: [
          {
            category: 'work',
            label: 'Base Work Hours',
            hoursPerWeek: 40,
            hoursPerYear: 2000,
            percentage: 100,
          },
        ],
        totalWeeklyHours: 40,
        nominalWage: {
          weeksPerYear: 50,
        },
      } as CalculationResults;

      mockUseCalculator.mockReturnValue({
        results: mockResults as CalculationResults,
        inputs: {},
        setInputs: vi.fn(),
        updateIncome: vi.fn(),
        updateMoneyExpenses: vi.fn(),
        updateTimeExpenses: vi.fn(),
        scenarios: [],
        saveCurrentAsScenario: vi.fn(),
        deleteScenario: vi.fn(),
        loadScenario: vi.fn(),
        saveToStorage: vi.fn(),
        loadFromStorage: vi.fn(),
        exportData: vi.fn(),
        importData: vi.fn(),
        resetAll: vi.fn(),
        applyPreset: vi.fn(),
        isHydrated: true,
      });

      const { container } = render(<TimeChart />);

      // Check for heading
      const heading = screen.getByText('Time Allocation');
      expect(heading.tagName).toBe('H3');

      // Check for proper text elements
      expect(container.querySelector('p')).toBeInTheDocument();
    });
  });
});
