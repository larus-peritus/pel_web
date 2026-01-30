import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SavingsDashboard } from '@/components/savingsReport/SavingsDashboard';
import { useCalculator } from '@/context/CalculatorContext';
import type { SavingsReport, SavingsReportResults } from '@/types/savingsReport';

// Mock the CalculatorContext
vi.mock('@/context/CalculatorContext', () => ({
  useCalculator: vi.fn(),
}));

// Mock child components to simplify testing
vi.mock('@/components/savingsReport/QuickStats', () => ({
  QuickStats: () => <div data-testid="quick-stats">QuickStats</div>,
}));

vi.mock('@/components/savingsReport/CategoryBreakdownChart', () => ({
  CategoryBreakdownChart: () => <div data-testid="breakdown-chart">BreakdownChart</div>,
}));

vi.mock('@/components/savingsReport/SavingsProgressList', () => ({
  SavingsProgressList: () => <div data-testid="progress-list">ProgressList</div>,
}));

vi.mock('@/components/savingsReport/SavingsRateInsights', () => ({
  SavingsRateInsights: () => <div data-testid="rate-insights">RateInsights</div>,
}));

describe('SavingsDashboard', () => {
  const mockOnEditClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockSavingsReport: SavingsReport = {
    categories: [
      {
        id: 'neydarsjodur',
        name: 'Neyðarsjóður',
        icon: '🛡️',
        description: 'Emergency fund',
        order: 1,
        data: {
          balance: 500000,
          monthlyContribution: 50000,
        },
        isHidden: false,
      },
    ],
    lastUpdated: new Date(),
    version: 1,
  };

  const mockResults: SavingsReportResults = {
    totalSavings: 500000,
    totalMonthlyContribution: 50000,
    totalAnnualContribution: 600000,
    savingsRate: 25,
    savingsRateContext: {
      rate: 25,
      level: 'moderate',
      messageIs: 'Good',
      fiEstimateYears: 30,
    },
    categoryBreakdown: [
      {
        categoryId: 'neydarsjodur',
        categoryName: 'Neyðarsjóður',
        icon: '🛡️',
        balance: 500000,
        monthlyContribution: 50000,
        percentageOfTotal: 100,
      },
    ],
    lifeEnergy: {
      totalBalanceHours: 200,
      totalContributionHoursPerMonth: 20,
      totalContributionHoursPerYear: 240,
    },
  };

  describe('Empty State', () => {
    it('should render empty state when no savings report', () => {
      vi.mocked(useCalculator).mockReturnValue({
        savingsReport: null,
        savingsReportResults: null,
      } as any);

      render(<SavingsDashboard onEditClick={mockOnEditClick} />);

      expect(screen.getByText('Yfirlit')).toBeTruthy();
      expect(screen.getByText('Enginn sparnaður skráður')).toBeTruthy();
      expect(
        screen.getByText(/Byrjaðu að fylgjast með sparnaðinum þínum/)
      ).toBeTruthy();
    });

    it('should render empty state when no savings results', () => {
      vi.mocked(useCalculator).mockReturnValue({
        savingsReport: mockSavingsReport,
        savingsReportResults: null,
      } as any);

      render(<SavingsDashboard onEditClick={mockOnEditClick} />);

      expect(screen.getByText('Enginn sparnaður skráður')).toBeTruthy();
    });

    it('should render empty state when categories array is empty', () => {
      vi.mocked(useCalculator).mockReturnValue({
        savingsReport: { ...mockSavingsReport, categories: [] },
        savingsReportResults: mockResults,
      } as any);

      render(<SavingsDashboard onEditClick={mockOnEditClick} />);

      expect(screen.getByText('Enginn sparnaður skráður')).toBeTruthy();
    });

    it('should have call-to-action button in empty state', () => {
      vi.mocked(useCalculator).mockReturnValue({
        savingsReport: null,
        savingsReportResults: null,
      } as any);

      render(<SavingsDashboard onEditClick={mockOnEditClick} />);

      const button = screen.getByRole('button', { name: /Byrja að skrá sparnaður/i });
      expect(button).toBeTruthy();
    });

    it('should call onEditClick when CTA button clicked', async () => {
      const user = userEvent.setup();
      vi.mocked(useCalculator).mockReturnValue({
        savingsReport: null,
        savingsReportResults: null,
      } as any);

      render(<SavingsDashboard onEditClick={mockOnEditClick} />);

      const button = screen.getByRole('button', { name: /Byrja að skrá sparnaður/i });
      await user.click(button);

      expect(mockOnEditClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Dashboard with Data', () => {
    beforeEach(() => {
      vi.mocked(useCalculator).mockReturnValue({
        savingsReport: mockSavingsReport,
        savingsReportResults: mockResults,
      } as any);
    });

    it('should render dashboard header', () => {
      render(<SavingsDashboard onEditClick={mockOnEditClick} />);

      expect(screen.getByText('Yfirlit')).toBeTruthy();
    });

    it('should render edit button in header', () => {
      render(<SavingsDashboard onEditClick={mockOnEditClick} />);

      const editButton = screen.getByRole('button', { name: /Breyta/i });
      expect(editButton).toBeTruthy();
    });

    it('should call onEditClick when edit button clicked', async () => {
      const user = userEvent.setup();
      render(<SavingsDashboard onEditClick={mockOnEditClick} />);

      const editButton = screen.getByRole('button', { name: /Breyta/i });
      await user.click(editButton);

      expect(mockOnEditClick).toHaveBeenCalledTimes(1);
    });

    it('should render QuickStats component', () => {
      render(<SavingsDashboard onEditClick={mockOnEditClick} />);

      expect(screen.getByTestId('quick-stats')).toBeTruthy();
    });

    it('should render CategoryBreakdownChart', () => {
      render(<SavingsDashboard onEditClick={mockOnEditClick} />);

      expect(screen.getByTestId('breakdown-chart')).toBeTruthy();
    });

    it('should render SavingsRateInsights', () => {
      render(<SavingsDashboard onEditClick={mockOnEditClick} />);

      expect(screen.getByTestId('rate-insights')).toBeTruthy();
    });

    it('should render SavingsProgressList', () => {
      render(<SavingsDashboard onEditClick={mockOnEditClick} />);

      expect(screen.getByTestId('progress-list')).toBeTruthy();
    });
  });

  describe('Layout', () => {
    beforeEach(() => {
      vi.mocked(useCalculator).mockReturnValue({
        savingsReport: mockSavingsReport,
        savingsReportResults: mockResults,
      } as any);
    });

    it('should have proper spacing between sections', () => {
      const { container } = render(<SavingsDashboard onEditClick={mockOnEditClick} />);

      const mainContainer = container.querySelector('.space-y-6');
      expect(mainContainer).toBeTruthy();
    });

    it('should use two-column grid for charts on large screens', () => {
      const { container } = render(<SavingsDashboard onEditClick={mockOnEditClick} />);

      const gridContainer = container.querySelector('.grid.lg\\:grid-cols-2');
      expect(gridContainer).toBeTruthy();
    });
  });

  describe('Button Variants', () => {
    it('should use secondary variant for edit button', () => {
      vi.mocked(useCalculator).mockReturnValue({
        savingsReport: mockSavingsReport,
        savingsReportResults: mockResults,
      } as any);

      const { container } = render(<SavingsDashboard onEditClick={mockOnEditClick} />);

      const editButton = screen.getByRole('button', { name: /Breyta/i });
      // Secondary buttons have border
      expect(editButton.classList.contains('border')).toBe(true);
    });

    it('should use large button in empty state', () => {
      vi.mocked(useCalculator).mockReturnValue({
        savingsReport: null,
        savingsReportResults: null,
      } as any);

      render(<SavingsDashboard onEditClick={mockOnEditClick} />);

      const ctaButton = screen.getByRole('button', { name: /Byrja að skrá sparnaður/i });
      // Large buttons have px-6 py-3
      expect(ctaButton.classList.contains('px-6')).toBe(true);
      expect(ctaButton.classList.contains('py-3')).toBe(true);
    });
  });
});
