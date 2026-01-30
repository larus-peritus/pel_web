import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExpenseRankings } from '@/components/calculator/ExpenseRankings';
import type { CalculationResults } from '@/types/calculator';

// Mock the calculator context
const mockUseCalculator = vi.fn();
vi.mock('@/context/CalculatorContext', () => ({
  useCalculator: () => mockUseCalculator(),
}));

describe('ExpenseRankings', () => {
  const mockResults: CalculationResults = {
    nominalHourlyWage: 25,
    actualHourlyWage: 20,
    percentageReduction: 20,
    netAnnualIncome: 45000,
    totalMoneyExpenses: 5000,
    baseWeeklyHours: 40,
    totalWeeklyHours: 50,
    totalExtraHours: 10,
    annualLifeEnergyHours: 2500,
    expenseBreakdown: [
      {
        category: 'commute',
        label: 'Commute Costs',
        amount: 2400,
        lifeEnergyHours: 120,
        percentage: 48,
      },
      {
        category: 'meals',
        label: 'Work Meals',
        amount: 1600,
        lifeEnergyHours: 80,
        percentage: 32,
      },
      {
        category: 'clothing',
        label: 'Work Clothing',
        amount: 1000,
        lifeEnergyHours: 50,
        percentage: 20,
      },
    ],
    timeBreakdown: [],
  };

  it('renders nothing when results are null', () => {
    mockUseCalculator.mockReturnValue({ results: null });
    const { container } = render(<ExpenseRankings />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when expense breakdown is empty', () => {
    mockUseCalculator.mockReturnValue({
      results: { ...mockResults, expenseBreakdown: [] },
    });
    const { container } = render(<ExpenseRankings />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the component title and description', () => {
    mockUseCalculator.mockReturnValue({ results: mockResults });
    render(<ExpenseRankings />);

    expect(screen.getByText('Expense Impact Rankings')).toBeInTheDocument();
    expect(
      screen.getByText('Your work expenses ranked by life-energy cost')
    ).toBeInTheDocument();
  });

  it('displays all expense items with labels', () => {
    mockUseCalculator.mockReturnValue({ results: mockResults });
    render(<ExpenseRankings />);

    expect(screen.getByText('Commute Costs')).toBeInTheDocument();
    expect(screen.getByText('Work Meals')).toBeInTheDocument();
    expect(screen.getByText('Work Clothing')).toBeInTheDocument();
  });

  it('displays rank numbers for each item', () => {
    mockUseCalculator.mockReturnValue({ results: mockResults });
    render(<ExpenseRankings />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('displays currency amounts for each expense', () => {
    mockUseCalculator.mockReturnValue({ results: mockResults });
    render(<ExpenseRankings />);

    expect(screen.getByText('$2,400.00')).toBeInTheDocument();
    expect(screen.getByText('$1,600.00')).toBeInTheDocument();
    expect(screen.getByText('$1,000.00')).toBeInTheDocument();
  });

  it('displays life energy hours for each expense', () => {
    mockUseCalculator.mockReturnValue({ results: mockResults });
    render(<ExpenseRankings />);

    // formatLifeEnergy should convert 120 hours to "15 work days"
    // formatLifeEnergy should convert 80 hours to "10 work days"
    // formatLifeEnergy should convert 50 hours to "6 days 2h"
    expect(screen.getByText(/15 work days/i)).toBeInTheDocument();
    expect(screen.getByText(/10 work days/i)).toBeInTheDocument();
    expect(screen.getByText(/6 days 2h/i)).toBeInTheDocument();
  });

  it('displays total annual expenses', () => {
    mockUseCalculator.mockReturnValue({ results: mockResults });
    render(<ExpenseRankings />);

    expect(screen.getByText('Total Annual Expenses')).toBeInTheDocument();
    expect(screen.getByText('$5,000.00')).toBeInTheDocument();
  });

  it('applies error color to rank #1', () => {
    mockUseCalculator.mockReturnValue({ results: mockResults });
    const { container } = render(<ExpenseRankings />);

    // Find the first rank badge (rank 1) - use more specific selector
    const rankBadges = container.querySelectorAll('.w-6.h-6.rounded-full');
    expect(rankBadges[0]).toHaveClass('bg-error-100', 'text-error-700');
  });

  it('applies warning color to rank #2', () => {
    mockUseCalculator.mockReturnValue({ results: mockResults });
    const { container } = render(<ExpenseRankings />);

    // Find the second rank badge (rank 2) - use more specific selector
    const rankBadges = container.querySelectorAll('.w-6.h-6.rounded-full');
    expect(rankBadges[1]).toHaveClass('bg-warning-100', 'text-warning-700');
  });

  it('applies neutral color to ranks #3+', () => {
    mockUseCalculator.mockReturnValue({ results: mockResults });
    const { container } = render(<ExpenseRankings />);

    // Find the third rank badge (rank 3) - use more specific selector
    const rankBadges = container.querySelectorAll('.w-6.h-6.rounded-full');
    expect(rankBadges[2]).toHaveClass('bg-neutral-100', 'text-neutral-600');
  });

  it('renders progress bars for each expense', () => {
    mockUseCalculator.mockReturnValue({ results: mockResults });
    const { container } = render(<ExpenseRankings />);

    // Find all progress bar containers
    const progressBars = container.querySelectorAll('.h-2.bg-neutral-100');
    expect(progressBars.length).toBe(3);
  });

  it('scales progress bars relative to maximum expense', () => {
    mockUseCalculator.mockReturnValue({ results: mockResults });
    const { container } = render(<ExpenseRankings />);

    // Find all progress bar fills
    const progressBarFills = container.querySelectorAll('.h-full.rounded-full');

    // First item (2400) should be 100% width
    expect(progressBarFills[0]).toHaveStyle({ width: '100%' });

    // Second item (1600) should be 66.67% width (1600/2400)
    expect(progressBarFills[1]).toHaveStyle({ width: `${(1600/2400) * 100}%` });

    // Third item (1000) should be 41.67% width (1000/2400)
    expect(progressBarFills[2]).toHaveStyle({ width: `${(1000/2400) * 100}%` });
  });

  it('applies error color to progress bar #1', () => {
    mockUseCalculator.mockReturnValue({ results: mockResults });
    const { container } = render(<ExpenseRankings />);

    const progressBarFills = container.querySelectorAll('.h-full.rounded-full');
    expect(progressBarFills[0]).toHaveClass('bg-error-500');
  });

  it('applies warning color to progress bar #2', () => {
    mockUseCalculator.mockReturnValue({ results: mockResults });
    const { container } = render(<ExpenseRankings />);

    const progressBarFills = container.querySelectorAll('.h-full.rounded-full');
    expect(progressBarFills[1]).toHaveClass('bg-warning-500');
  });

  it('applies neutral color to progress bars #3+', () => {
    mockUseCalculator.mockReturnValue({ results: mockResults });
    const { container } = render(<ExpenseRankings />);

    const progressBarFills = container.querySelectorAll('.h-full.rounded-full');
    expect(progressBarFills[2]).toHaveClass('bg-neutral-400');
  });

  it('handles single expense item', () => {
    const singleExpenseResults = {
      ...mockResults,
      expenseBreakdown: [mockResults.expenseBreakdown[0]],
      totalMoneyExpenses: 2400,
    };

    mockUseCalculator.mockReturnValue({ results: singleExpenseResults });
    render(<ExpenseRankings />);

    expect(screen.getByText('Commute Costs')).toBeInTheDocument();
    // Use getAllByText since $2,400.00 appears both in the item and in the total
    const amounts = screen.getAllByText('$2,400.00');
    expect(amounts.length).toBeGreaterThan(0);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('handles many expense items', () => {
    const manyExpensesResults = {
      ...mockResults,
      expenseBreakdown: [
        ...mockResults.expenseBreakdown,
        {
          category: 'decompression',
          label: 'Decompression Spending',
          amount: 800,
          lifeEnergyHours: 40,
          percentage: 16,
        },
        {
          category: 'childcare',
          label: 'Childcare Delta',
          amount: 600,
          lifeEnergyHours: 30,
          percentage: 12,
        },
        {
          category: 'other',
          label: 'Other Expenses',
          amount: 400,
          lifeEnergyHours: 20,
          percentage: 8,
        },
      ],
    };

    mockUseCalculator.mockReturnValue({ results: manyExpensesResults });
    const { container } = render(<ExpenseRankings />);

    // Should display all 6 items
    expect(screen.getByText('Commute Costs')).toBeInTheDocument();
    expect(screen.getByText('Work Meals')).toBeInTheDocument();
    expect(screen.getByText('Work Clothing')).toBeInTheDocument();
    expect(screen.getByText('Decompression Spending')).toBeInTheDocument();
    expect(screen.getByText('Childcare Delta')).toBeInTheDocument();
    expect(screen.getByText('Other Expenses')).toBeInTheDocument();

    // Check rank numbers - there are 6 expense items, each with a badge and a progress bar
    // So we expect 6 rank badges (.w-6.h-6.rounded-full) and 6 progress bar containers (.h-2.rounded-full)
    const rankBadges = container.querySelectorAll('.w-6.h-6.rounded-full');
    expect(rankBadges.length).toBe(6);
  });

  it('uses Card component with outlined variant', () => {
    mockUseCalculator.mockReturnValue({ results: mockResults });
    const { container } = render(<ExpenseRankings />);

    // Card with outlined variant should have border-2
    const card = container.querySelector('.border-2');
    expect(card).toBeInTheDocument();
  });

  it('has proper spacing between expense items', () => {
    mockUseCalculator.mockReturnValue({ results: mockResults });
    const { container } = render(<ExpenseRankings />);

    // The main list container should have space-y-4
    const listContainer = container.querySelector('.space-y-4');
    expect(listContainer).toBeInTheDocument();
  });

  it('includes transition animation on progress bars', () => {
    mockUseCalculator.mockReturnValue({ results: mockResults });
    const { container } = render(<ExpenseRankings />);

    const progressBarFills = container.querySelectorAll('.h-full.rounded-full');
    progressBarFills.forEach(bar => {
      expect(bar).toHaveClass('transition-all', 'duration-500');
    });
  });
});
