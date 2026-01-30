import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BreakdownChart } from '@/components/calculator/BreakdownChart';
import type { CalculatorInputs, CalculationResults } from '@/types/calculator';
import { DEFAULT_INPUTS } from '@/lib/defaults';

// Mock the calculator context
vi.mock('@/context/CalculatorContext', () => ({
  useCalculator: vi.fn(),
}));

import { useCalculator } from '@/context/CalculatorContext';

describe('BreakdownChart', () => {
  const mockUseCalculator = useCalculator as ReturnType<typeof vi.fn>;

  const mockInputs: CalculatorInputs = {
    ...DEFAULT_INPUTS,
    income: {
      grossAnnualIncome: 50000,
      workHoursPerWeek: 40,
      vacationDays: 10,
      additionalIncome: 5000,
    },
  };

  const mockResults: CalculationResults = {
    nominalHourlyWage: 27.5,
    actualHourlyWage: 22.5,
    percentageReduction: 18.18,
    netAnnualIncome: 45000,
    totalMoneyExpenses: 10000,
    baseWeeklyHours: 40,
    totalWeeklyHours: 45,
    totalExtraHours: 5,
    annualLifeEnergyHours: 2250,
    expenseBreakdown: [
      {
        category: 'commute',
        label: 'Commute Costs',
        amount: 5000,
        lifeEnergyHours: 222.22,
        percentage: 50,
      },
      {
        category: 'meals',
        label: 'Work Meals',
        amount: 3000,
        lifeEnergyHours: 133.33,
        percentage: 30,
      },
      {
        category: 'clothing',
        label: 'Work Clothing',
        amount: 2000,
        lifeEnergyHours: 88.89,
        percentage: 20,
      },
    ],
    timeBreakdown: [],
  };

  describe('Rendering', () => {
    it('should not render when results is null', () => {
      mockUseCalculator.mockReturnValue({
        results: null,
        inputs: mockInputs,
      });

      const { container } = render(<BreakdownChart />);
      expect(container.firstChild).toBeNull();
    });

    it('should render the component when results exist', () => {
      mockUseCalculator.mockReturnValue({
        results: mockResults,
        inputs: mockInputs,
      });

      render(<BreakdownChart />);
      expect(screen.getByText('Income Breakdown')).toBeInTheDocument();
    });

    it('should render the description text', () => {
      mockUseCalculator.mockReturnValue({
        results: mockResults,
        inputs: mockInputs,
      });

      render(<BreakdownChart />);
      expect(screen.getByText('How work expenses reduce your take-home pay')).toBeInTheDocument();
    });
  });

  describe('Gross Income Display', () => {
    it('should display gross income label', () => {
      mockUseCalculator.mockReturnValue({
        results: mockResults,
        inputs: mockInputs,
      });

      render(<BreakdownChart />);
      expect(screen.getByText('Gross Income')).toBeInTheDocument();
    });

    it('should calculate and display total gross income', () => {
      mockUseCalculator.mockReturnValue({
        results: mockResults,
        inputs: mockInputs,
      });

      render(<BreakdownChart />);
      // $50,000 + $5,000 = $55,000
      expect(screen.getByText('$55,000.00')).toBeInTheDocument();
    });

    it('should display gross income without additional income', () => {
      const inputsNoAdditional = {
        ...mockInputs,
        income: { ...mockInputs.income, additionalIncome: 0 },
      };

      mockUseCalculator.mockReturnValue({
        results: mockResults,
        inputs: inputsNoAdditional,
      });

      render(<BreakdownChart />);
      expect(screen.getByText('$50,000.00')).toBeInTheDocument();
    });
  });

  describe('Expense Breakdown Display', () => {
    it('should display all expense categories', () => {
      mockUseCalculator.mockReturnValue({
        results: mockResults,
        inputs: mockInputs,
      });

      render(<BreakdownChart />);
      expect(screen.getByText(/Commute Costs/)).toBeInTheDocument();
      expect(screen.getByText(/Work Meals/)).toBeInTheDocument();
      expect(screen.getByText(/Work Clothing/)).toBeInTheDocument();
    });

    it('should display expense amounts with minus sign', () => {
      mockUseCalculator.mockReturnValue({
        results: mockResults,
        inputs: mockInputs,
      });

      render(<BreakdownChart />);
      expect(screen.getByText('-$5,000.00')).toBeInTheDocument();
      expect(screen.getByText('-$3,000.00')).toBeInTheDocument();
      expect(screen.getByText('-$2,000.00')).toBeInTheDocument();
    });

    it('should render progress bars for each expense', () => {
      mockUseCalculator.mockReturnValue({
        results: mockResults,
        inputs: mockInputs,
      });

      const { container } = render(<BreakdownChart />);
      const progressBars = container.querySelectorAll('.bg-error-400');
      // One for each expense
      expect(progressBars.length).toBe(3);
    });

    it('should handle empty expense breakdown', () => {
      const resultsNoExpenses = {
        ...mockResults,
        expenseBreakdown: [],
        totalMoneyExpenses: 0,
      };

      mockUseCalculator.mockReturnValue({
        results: resultsNoExpenses,
        inputs: mockInputs,
      });

      render(<BreakdownChart />);
      expect(screen.getByText('Gross Income')).toBeInTheDocument();
      expect(screen.getByText('Net Work Income')).toBeInTheDocument();
      // No expense labels should be present
      expect(screen.queryByText(/Commute Costs/)).not.toBeInTheDocument();
    });
  });

  describe('Net Income Display', () => {
    it('should display net income label', () => {
      mockUseCalculator.mockReturnValue({
        results: mockResults,
        inputs: mockInputs,
      });

      render(<BreakdownChart />);
      expect(screen.getByText('Net Work Income')).toBeInTheDocument();
    });

    it('should display net annual income amount', () => {
      mockUseCalculator.mockReturnValue({
        results: mockResults,
        inputs: mockInputs,
      });

      render(<BreakdownChart />);
      expect(screen.getByText('$45,000.00')).toBeInTheDocument();
    });

    it('should display percentage of income retained', () => {
      mockUseCalculator.mockReturnValue({
        results: mockResults,
        inputs: mockInputs,
      });

      render(<BreakdownChart />);
      // 45000 / 55000 = 81.8%
      expect(screen.getByText('81.8% of gross income retained')).toBeInTheDocument();
    });
  });

  describe('Color Coding', () => {
    it('should use success color when retention >= 80%', () => {
      // 81.8% retention (45000 / 55000)
      mockUseCalculator.mockReturnValue({
        results: mockResults,
        inputs: mockInputs,
      });

      const { container } = render(<BreakdownChart />);
      const netBar = container.querySelector('.bg-success-500');
      expect(netBar).toBeInTheDocument();
    });

    it('should use primary color when retention >= 60% and < 80%', () => {
      const resultsLowRetention = {
        ...mockResults,
        netAnnualIncome: 35000, // 63.6% retention
      };

      mockUseCalculator.mockReturnValue({
        results: resultsLowRetention,
        inputs: mockInputs,
      });

      const { container } = render(<BreakdownChart />);
      const netBar = container.querySelector('.bg-primary-500');
      expect(netBar).toBeInTheDocument();
    });

    it('should use warning color when retention >= 40% and < 60%', () => {
      const resultsLowRetention = {
        ...mockResults,
        netAnnualIncome: 27500, // 50% retention
      };

      mockUseCalculator.mockReturnValue({
        results: resultsLowRetention,
        inputs: mockInputs,
      });

      const { container } = render(<BreakdownChart />);
      const netBar = container.querySelector('.bg-warning-500');
      expect(netBar).toBeInTheDocument();
    });

    it('should use error color when retention < 40%', () => {
      const resultsLowRetention = {
        ...mockResults,
        netAnnualIncome: 15000, // 27.3% retention
      };

      mockUseCalculator.mockReturnValue({
        results: resultsLowRetention,
        inputs: mockInputs,
      });

      const { container } = render(<BreakdownChart />);
      const netBar = container.querySelector('.bg-error-500');
      expect(netBar).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero gross income', () => {
      const inputsZeroIncome = {
        ...mockInputs,
        income: {
          ...mockInputs.income,
          grossAnnualIncome: 0,
          additionalIncome: 0,
        },
      };

      const resultsZeroIncome = {
        ...mockResults,
        netAnnualIncome: 0,
      };

      mockUseCalculator.mockReturnValue({
        results: resultsZeroIncome,
        inputs: inputsZeroIncome,
      });

      render(<BreakdownChart />);
      // Multiple $0.00 values (gross income and net income), so use getAllByText
      const zeroValues = screen.getAllByText('$0.00');
      expect(zeroValues.length).toBeGreaterThan(0);
      expect(screen.getByText('0.0% of gross income retained')).toBeInTheDocument();
    });

    it('should handle very high expenses (over 100%)', () => {
      const resultsHighExpenses = {
        ...mockResults,
        netAnnualIncome: -5000, // Negative net income
        totalMoneyExpenses: 60000,
        expenseBreakdown: [
          {
            category: 'commute',
            label: 'Commute Costs',
            amount: 60000,
            lifeEnergyHours: 2666.67,
            percentage: 100,
          },
        ],
      };

      const inputsLowIncome = {
        ...mockInputs,
        income: {
          ...mockInputs.income,
          grossAnnualIncome: 50000,
          additionalIncome: 0,
        },
      };

      mockUseCalculator.mockReturnValue({
        results: resultsHighExpenses,
        inputs: inputsLowIncome,
      });

      render(<BreakdownChart />);
      // Should display negative net income - but there are expense deductions too with minus signs
      // Use getAllByText since there may be multiple minus signs
      const negativeValues = screen.getAllByText(/-\$5,000\.00/);
      expect(negativeValues.length).toBeGreaterThan(0);
    });

    it('should apply transition classes for animations', () => {
      mockUseCalculator.mockReturnValue({
        results: mockResults,
        inputs: mockInputs,
      });

      const { container } = render(<BreakdownChart />);
      const transitionElements = container.querySelectorAll('.transition-all');
      // Should have transition classes on expense bars and net bar
      expect(transitionElements.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic HTML structure', () => {
      mockUseCalculator.mockReturnValue({
        results: mockResults,
        inputs: mockInputs,
      });

      render(<BreakdownChart />);
      const heading = screen.getByRole('heading', { name: /Income Breakdown/i });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H3');
    });

    it('should display currency values in accessible format', () => {
      mockUseCalculator.mockReturnValue({
        results: mockResults,
        inputs: mockInputs,
      });

      render(<BreakdownChart />);
      // All currency values should be formatted with proper symbols
      const currencyElements = screen.getAllByText(/\$/);
      expect(currencyElements.length).toBeGreaterThan(0);
    });
  });
});
