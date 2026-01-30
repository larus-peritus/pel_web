import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LifeEnergyConverter } from '@/components/calculator/LifeEnergyConverter';
import { useCalculator } from '@/context/CalculatorContext';
import type { CalculationResults } from '@/types/calculator';

// Mock the CalculatorContext
vi.mock('@/context/CalculatorContext', () => ({
  useCalculator: vi.fn(),
}));

describe('LifeEnergyConverter', () => {
  const mockResults: CalculationResults = {
    nominalHourlyWage: 25,
    actualHourlyWage: 20,
    totalMoneyExpenses: 200,
    totalExtraTime: 10,
    totalWeeklyHours: 50,
    grossAnnualIncome: 52000,
    netAnnualIncome: 41600,
    costPerWorkHour: 4,
    expenseBreakdown: [],
    timeBreakdown: [],
  };

  const mockUseCalculator = vi.mocked(useCalculator);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render when results are available', () => {
      mockUseCalculator.mockReturnValue({
        results: mockResults,
      } as any);

      render(<LifeEnergyConverter />);

      expect(screen.getByText('Life Energy Converter')).toBeInTheDocument();
      expect(screen.getByText('See how much of your life a purchase costs')).toBeInTheDocument();
    });

    it('should return null when results are not available', () => {
      mockUseCalculator.mockReturnValue({
        results: null,
      } as any);

      const { container } = render(<LifeEnergyConverter />);

      expect(container.firstChild).toBeNull();
    });

    it('should display all quick amount buttons', () => {
      mockUseCalculator.mockReturnValue({
        results: mockResults,
      } as any);

      render(<LifeEnergyConverter />);

      expect(screen.getByRole('button', { name: '$50' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '$100' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '$500' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '$1000' })).toBeInTheDocument();
    });

    it('should render currency input with correct label', () => {
      mockUseCalculator.mockReturnValue({
        results: mockResults,
      } as any);

      render(<LifeEnergyConverter />);

      expect(screen.getByLabelText('Enter amount')).toBeInTheDocument();
    });
  });

  describe('Default State', () => {
    it('should default to $100', () => {
      mockUseCalculator.mockReturnValue({
        results: mockResults,
      } as any);

      render(<LifeEnergyConverter />);

      // Default is $100, with actualWage of $20, that's 5 hours
      expect(screen.getByText('5 hours')).toBeInTheDocument();
    });

    it('should highlight the $100 button by default', () => {
      mockUseCalculator.mockReturnValue({
        results: mockResults,
      } as any);

      render(<LifeEnergyConverter />);

      const button100 = screen.getByRole('button', { name: '$100' });
      // Primary variant button should have bg-primary-600
      expect(button100.className).toContain('bg-primary-600');
    });
  });

  describe('Life Energy Calculation', () => {
    it('should correctly calculate life energy for default amount', () => {
      mockUseCalculator.mockReturnValue({
        results: mockResults,
      } as any);

      render(<LifeEnergyConverter />);

      // $100 / $20/hr = 5 hours
      expect(screen.getByText('5 hours')).toBeInTheDocument();
    });

    it('should handle fractional hours correctly', () => {
      mockUseCalculator.mockReturnValue({
        results: mockResults,
      } as any);

      render(<LifeEnergyConverter />);

      // Click $50 button
      const button50 = screen.getByRole('button', { name: '$50' });
      fireEvent.click(button50);

      // $50 / $20/hr = 2.5 hours = 2h 30m
      expect(screen.getByText('2h 30m')).toBeInTheDocument();
    });

    it('should format as minutes for small amounts', () => {
      // Set a higher wage so we can get minutes
      const highWageResults = { ...mockResults, actualHourlyWage: 100 };
      mockUseCalculator.mockReturnValue({
        results: highWageResults,
      } as any);

      render(<LifeEnergyConverter />);

      // Click $50 button
      const button50 = screen.getByRole('button', { name: '$50' });
      fireEvent.click(button50);

      // $50 / $100/hr = 0.5 hours = 30 minutes
      expect(screen.getByText('30 minutes')).toBeInTheDocument();
    });

    it('should format as work days for large amounts', () => {
      mockUseCalculator.mockReturnValue({
        results: mockResults,
      } as any);

      render(<LifeEnergyConverter />);

      // Click $1000 button
      const button1000 = screen.getByRole('button', { name: '$1000' });
      fireEvent.click(button1000);

      // $1000 / $20/hr = 50 hours = 6 days 2h (50 / 8 = 6.25 days)
      expect(screen.getByText('6 days 2h')).toBeInTheDocument();
    });

    it('should handle zero actual wage gracefully', () => {
      const zeroWageResults = { ...mockResults, actualHourlyWage: 0 };
      mockUseCalculator.mockReturnValue({
        results: zeroWageResults,
      } as any);

      render(<LifeEnergyConverter />);

      // Should show 0 minutes
      expect(screen.getByText('0 minutes')).toBeInTheDocument();
    });
  });

  describe('Quick Amount Buttons', () => {
    it('should update amount when clicking quick button', () => {
      mockUseCalculator.mockReturnValue({
        results: mockResults,
      } as any);

      render(<LifeEnergyConverter />);

      // Click $500 button
      const button500 = screen.getByRole('button', { name: '$500' });
      fireEvent.click(button500);

      // $500 / $20/hr = 25 hours = 3 days 1h
      expect(screen.getByText('3 days 1h')).toBeInTheDocument();
    });

    it('should highlight active button', () => {
      mockUseCalculator.mockReturnValue({
        results: mockResults,
      } as any);

      render(<LifeEnergyConverter />);

      const button50 = screen.getByRole('button', { name: '$50' });
      fireEvent.click(button50);

      // Button should have primary variant styles
      expect(button50.className).toContain('bg-primary-600');
    });

    it('should remove highlight from previous button', () => {
      mockUseCalculator.mockReturnValue({
        results: mockResults,
      } as any);

      render(<LifeEnergyConverter />);

      const button100 = screen.getByRole('button', { name: '$100' });
      const button50 = screen.getByRole('button', { name: '$50' });

      // Initially $100 is highlighted
      expect(button100.className).toContain('bg-primary-600');

      // Click $50
      fireEvent.click(button50);

      // Now $100 should have secondary variant, $50 should have primary
      expect(button100.className).toContain('bg-white');
      expect(button50.className).toContain('bg-primary-600');
    });

    it('should work for all quick amounts', () => {
      mockUseCalculator.mockReturnValue({
        results: mockResults,
      } as any);

      render(<LifeEnergyConverter />);

      // Test each button
      const amounts = [
        { button: '$50', expected: '2h 30m' }, // 50 / 20 = 2.5h
        { button: '$100', expected: '5 hours' }, // 100 / 20 = 5h
        { button: '$500', expected: '3 days 1h' }, // 500 / 20 = 25h = 3 days 1h
        { button: '$1000', expected: '6 days 2h' }, // 1000 / 20 = 50h = 6 days 2h
      ];

      amounts.forEach(({ button, expected }) => {
        fireEvent.click(screen.getByRole('button', { name: button }));
        expect(screen.getByText(expected)).toBeInTheDocument();
      });
    });
  });

  describe('Manual Input', () => {
    it('should update life energy when typing custom amount', async () => {
      mockUseCalculator.mockReturnValue({
        results: mockResults,
      } as any);

      render(<LifeEnergyConverter />);

      const input = screen.getByLabelText('Enter amount');

      // Focus and change value
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: '200' } });

      await waitFor(() => {
        // $200 / $20/hr = 10 hours
        expect(screen.getByText('10 hours')).toBeInTheDocument();
      });
    });

    it('should deselect quick buttons when typing custom amount', async () => {
      mockUseCalculator.mockReturnValue({
        results: mockResults,
      } as any);

      render(<LifeEnergyConverter />);

      const input = screen.getByLabelText('Enter amount');
      const button100 = screen.getByRole('button', { name: '$100' });

      // Initially $100 is selected
      expect(button100.className).toContain('bg-primary-600');

      // Type custom amount
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: '250' } });

      await waitFor(() => {
        // Button should no longer have primary variant
        expect(button100.className).toContain('bg-white');
      });
    });
  });

  describe('Result Display', () => {
    it('should display all result text elements', () => {
      mockUseCalculator.mockReturnValue({
        results: mockResults,
      } as any);

      render(<LifeEnergyConverter />);

      expect(screen.getByText('This costs you')).toBeInTheDocument();
      expect(screen.getByText('5 hours')).toBeInTheDocument();
      expect(screen.getByText('of your life energy')).toBeInTheDocument();
    });

    it('should update result display when amount changes', () => {
      mockUseCalculator.mockReturnValue({
        results: mockResults,
      } as any);

      render(<LifeEnergyConverter />);

      // Initially shows 5 hours
      expect(screen.getByText('5 hours')).toBeInTheDocument();

      // Click different amount
      fireEvent.click(screen.getByRole('button', { name: '$50' }));

      // Should now show 2h 30m
      expect(screen.getByText('2h 30m')).toBeInTheDocument();
      expect(screen.queryByText('5 hours')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper label for input', () => {
      mockUseCalculator.mockReturnValue({
        results: mockResults,
      } as any);

      render(<LifeEnergyConverter />);

      const input = screen.getByLabelText('Enter amount');
      expect(input).toHaveAttribute('id', 'converter-amount');
    });

    it('should have semantic heading structure', () => {
      mockUseCalculator.mockReturnValue({
        results: mockResults,
      } as any);

      render(<LifeEnergyConverter />);

      const heading = screen.getByRole('heading', { name: 'Life Energy Converter' });
      expect(heading.tagName).toBe('H3');
    });
  });
});
