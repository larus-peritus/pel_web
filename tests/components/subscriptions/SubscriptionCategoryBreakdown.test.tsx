import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SubscriptionCategoryBreakdown } from '@/components/subscriptions/SubscriptionCategoryBreakdown';
import { useCalculator } from '@/context/CalculatorContext';
import type { SubscriptionSummary } from '@/types/calculator';

// Mock the useCalculator hook
vi.mock('@/context/CalculatorContext', () => ({
  useCalculator: vi.fn(),
}));

const mockUseCalculator = useCalculator as ReturnType<typeof vi.fn>;

describe('SubscriptionCategoryBreakdown', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render null when subscriptionSummary is null', () => {
      mockUseCalculator.mockReturnValue({
        subscriptionSummary: null,
      } as any);

      const { container } = render(<SubscriptionCategoryBreakdown />);
      expect(container.firstChild).toBeNull();
    });

    it('should render null when byCategory is empty', () => {
      const summary: SubscriptionSummary = {
        totalMonthly: 0,
        totalYearly: 0,
        lifeEnergyHoursPerMonth: 0,
        lifeEnergyHoursPerYear: 0,
        futureValueIn10Years: 0,
        futureValueIn20Years: 0,
        byCategory: [],
      };

      mockUseCalculator.mockReturnValue({
        subscriptionSummary: summary,
      } as any);

      const { container } = render(<SubscriptionCategoryBreakdown />);
      expect(container.firstChild).toBeNull();
    });

    it('should render null when all categories have count 0', () => {
      const summary: SubscriptionSummary = {
        totalMonthly: 0,
        totalYearly: 0,
        lifeEnergyHoursPerMonth: 0,
        lifeEnergyHoursPerYear: 0,
        futureValueIn10Years: 0,
        futureValueIn20Years: 0,
        byCategory: [
          {
            category: 'streaming',
            label: 'Streymi',
            totalMonthly: 0,
            count: 0,
          },
          {
            category: 'software',
            label: 'Hugbúnaður',
            totalMonthly: 0,
            count: 0,
          },
        ],
      };

      mockUseCalculator.mockReturnValue({
        subscriptionSummary: summary,
      } as any);

      const { container } = render(<SubscriptionCategoryBreakdown />);
      expect(container.firstChild).toBeNull();
    });

    it('should render category breakdown when categories have subscriptions', () => {
      const summary: SubscriptionSummary = {
        totalMonthly: 15000,
        totalYearly: 180000,
        lifeEnergyHoursPerMonth: 10,
        lifeEnergyHoursPerYear: 120,
        futureValueIn10Years: 1000000,
        futureValueIn20Years: 2000000,
        byCategory: [
          {
            category: 'streaming',
            label: 'Streymi',
            totalMonthly: 8969,
            count: 4,
          },
          {
            category: 'fitness',
            label: 'Líkamsrækt',
            totalMonthly: 6990,
            count: 1,
          },
        ],
      };

      mockUseCalculator.mockReturnValue({
        subscriptionSummary: summary,
      } as any);

      render(<SubscriptionCategoryBreakdown />);

      expect(screen.getByText('Kostnaður eftir flokkum')).toBeInTheDocument();
    });
  });

  describe('Category Display', () => {
    it('should display category label and count correctly', () => {
      const summary: SubscriptionSummary = {
        totalMonthly: 8969,
        totalYearly: 107628,
        lifeEnergyHoursPerMonth: 5,
        lifeEnergyHoursPerYear: 60,
        futureValueIn10Years: 500000,
        futureValueIn20Years: 1000000,
        byCategory: [
          {
            category: 'streaming',
            label: 'Streymi',
            totalMonthly: 8969,
            count: 4,
          },
        ],
      };

      mockUseCalculator.mockReturnValue({
        subscriptionSummary: summary,
      } as any);

      render(<SubscriptionCategoryBreakdown />);

      expect(screen.getByText('Streymi')).toBeInTheDocument();
      expect(screen.getByText(/4 áskriftir/)).toBeInTheDocument();
    });

    it('should use singular form for count of 1', () => {
      const summary: SubscriptionSummary = {
        totalMonthly: 6990,
        totalYearly: 83880,
        lifeEnergyHoursPerMonth: 5,
        lifeEnergyHoursPerYear: 60,
        futureValueIn10Years: 500000,
        futureValueIn20Years: 1000000,
        byCategory: [
          {
            category: 'fitness',
            label: 'Líkamsrækt',
            totalMonthly: 6990,
            count: 1,
          },
        ],
      };

      mockUseCalculator.mockReturnValue({
        subscriptionSummary: summary,
      } as any);

      render(<SubscriptionCategoryBreakdown />);

      expect(screen.getByText('Líkamsrækt')).toBeInTheDocument();
      expect(screen.getByText(/1 áskrift/)).toBeInTheDocument();
      expect(screen.queryByText(/áskriftir/)).not.toBeInTheDocument();
    });

    it('should display monthly cost for each category', () => {
      const summary: SubscriptionSummary = {
        totalMonthly: 15959,
        totalYearly: 191508,
        lifeEnergyHoursPerMonth: 10,
        lifeEnergyHoursPerYear: 120,
        futureValueIn10Years: 1000000,
        futureValueIn20Years: 2000000,
        byCategory: [
          {
            category: 'streaming',
            label: 'Streymi',
            totalMonthly: 8969,
            count: 4,
          },
          {
            category: 'fitness',
            label: 'Líkamsrækt',
            totalMonthly: 6990,
            count: 1,
          },
        ],
      };

      mockUseCalculator.mockReturnValue({
        subscriptionSummary: summary,
      } as any);

      render(<SubscriptionCategoryBreakdown />);

      expect(screen.getByText('8.969 kr')).toBeInTheDocument();
      expect(screen.getByText('6.990 kr')).toBeInTheDocument();
    });

    it('should display all categories with subscriptions', () => {
      const summary: SubscriptionSummary = {
        totalMonthly: 20000,
        totalYearly: 240000,
        lifeEnergyHoursPerMonth: 15,
        lifeEnergyHoursPerYear: 180,
        futureValueIn10Years: 1200000,
        futureValueIn20Years: 2400000,
        byCategory: [
          {
            category: 'streaming',
            label: 'Streymi',
            totalMonthly: 8969,
            count: 4,
          },
          {
            category: 'fitness',
            label: 'Líkamsrækt',
            totalMonthly: 6990,
            count: 1,
          },
          {
            category: 'software',
            label: 'Hugbúnaður',
            totalMonthly: 1448,
            count: 2,
          },
          {
            category: 'news',
            label: 'Fréttir',
            totalMonthly: 2593,
            count: 1,
          },
        ],
      };

      mockUseCalculator.mockReturnValue({
        subscriptionSummary: summary,
      } as any);

      render(<SubscriptionCategoryBreakdown />);

      expect(screen.getByText('Streymi')).toBeInTheDocument();
      expect(screen.getByText('Líkamsrækt')).toBeInTheDocument();
      expect(screen.getByText('Hugbúnaður')).toBeInTheDocument();
      expect(screen.getByText('Fréttir')).toBeInTheDocument();
    });

    it('should filter out categories with count 0', () => {
      const summary: SubscriptionSummary = {
        totalMonthly: 8969,
        totalYearly: 107628,
        lifeEnergyHoursPerMonth: 5,
        lifeEnergyHoursPerYear: 60,
        futureValueIn10Years: 500000,
        futureValueIn20Years: 1000000,
        byCategory: [
          {
            category: 'streaming',
            label: 'Streymi',
            totalMonthly: 8969,
            count: 4,
          },
          {
            category: 'gaming',
            label: 'Tölvuleikir',
            totalMonthly: 0,
            count: 0,
          },
        ],
      };

      mockUseCalculator.mockReturnValue({
        subscriptionSummary: summary,
      } as any);

      render(<SubscriptionCategoryBreakdown />);

      expect(screen.getByText('Streymi')).toBeInTheDocument();
      expect(screen.queryByText('Tölvuleikir')).not.toBeInTheDocument();
    });
  });

  describe('Progress Bar', () => {
    it('should calculate and display correct percentage', () => {
      const summary: SubscriptionSummary = {
        totalMonthly: 10000,
        totalYearly: 120000,
        lifeEnergyHoursPerMonth: 10,
        lifeEnergyHoursPerYear: 120,
        futureValueIn10Years: 1000000,
        futureValueIn20Years: 2000000,
        byCategory: [
          {
            category: 'streaming',
            label: 'Streymi',
            totalMonthly: 5000,
            count: 2,
          },
          {
            category: 'fitness',
            label: 'Líkamsrækt',
            totalMonthly: 3000,
            count: 1,
          },
        ],
      };

      mockUseCalculator.mockReturnValue({
        subscriptionSummary: summary,
      } as any);

      render(<SubscriptionCategoryBreakdown />);

      // 5000/10000 = 50%
      expect(screen.getByText('50%')).toBeInTheDocument();
      // 3000/10000 = 30%
      expect(screen.getByText('30%')).toBeInTheDocument();
    });

    it('should render progress bar with correct aria attributes', () => {
      const summary: SubscriptionSummary = {
        totalMonthly: 10000,
        totalYearly: 120000,
        lifeEnergyHoursPerMonth: 10,
        lifeEnergyHoursPerYear: 120,
        futureValueIn10Years: 1000000,
        futureValueIn20Years: 2000000,
        byCategory: [
          {
            category: 'streaming',
            label: 'Streymi',
            totalMonthly: 5000,
            count: 2,
          },
        ],
      };

      mockUseCalculator.mockReturnValue({
        subscriptionSummary: summary,
      } as any);

      render(<SubscriptionCategoryBreakdown />);

      const progressBar = screen.getByRole('progressbar', {
        name: /Streymi: 50% af heildarkostnaði/,
      });
      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toHaveAttribute('aria-valuenow', '50');
      expect(progressBar).toHaveAttribute('aria-valuemin', '0');
      expect(progressBar).toHaveAttribute('aria-valuemax', '100');
    });

    it('should handle 0 total without crashing', () => {
      const summary: SubscriptionSummary = {
        totalMonthly: 0,
        totalYearly: 0,
        lifeEnergyHoursPerMonth: 0,
        lifeEnergyHoursPerYear: 0,
        futureValueIn10Years: 0,
        futureValueIn20Years: 0,
        byCategory: [
          {
            category: 'streaming',
            label: 'Streymi',
            totalMonthly: 0,
            count: 1,
          },
        ],
      };

      mockUseCalculator.mockReturnValue({
        subscriptionSummary: summary,
      } as any);

      const { container } = render(<SubscriptionCategoryBreakdown />);
      expect(container.firstChild).toBeInTheDocument();
      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('should round percentage to whole number', () => {
      const summary: SubscriptionSummary = {
        totalMonthly: 9000,
        totalYearly: 108000,
        lifeEnergyHoursPerMonth: 10,
        lifeEnergyHoursPerYear: 120,
        futureValueIn10Years: 1000000,
        futureValueIn20Years: 2000000,
        byCategory: [
          {
            category: 'streaming',
            label: 'Streymi',
            totalMonthly: 5555,
            count: 2,
          },
        ],
      };

      mockUseCalculator.mockReturnValue({
        subscriptionSummary: summary,
      } as any);

      render(<SubscriptionCategoryBreakdown />);

      // 5555/9000 = 61.72% -> should display as 62%
      expect(screen.getByText('62%')).toBeInTheDocument();
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className when provided', () => {
      const summary: SubscriptionSummary = {
        totalMonthly: 5000,
        totalYearly: 60000,
        lifeEnergyHoursPerMonth: 5,
        lifeEnergyHoursPerYear: 60,
        futureValueIn10Years: 500000,
        futureValueIn20Years: 1000000,
        byCategory: [
          {
            category: 'streaming',
            label: 'Streymi',
            totalMonthly: 5000,
            count: 2,
          },
        ],
      };

      mockUseCalculator.mockReturnValue({
        subscriptionSummary: summary,
      } as any);

      const { container } = render(
        <SubscriptionCategoryBreakdown className="custom-class" />
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large numbers', () => {
      const summary: SubscriptionSummary = {
        totalMonthly: 999999,
        totalYearly: 11999988,
        lifeEnergyHoursPerMonth: 100,
        lifeEnergyHoursPerYear: 1200,
        futureValueIn10Years: 10000000,
        futureValueIn20Years: 20000000,
        byCategory: [
          {
            category: 'streaming',
            label: 'Streymi',
            totalMonthly: 999999,
            count: 100,
          },
        ],
      };

      mockUseCalculator.mockReturnValue({
        subscriptionSummary: summary,
      } as any);

      render(<SubscriptionCategoryBreakdown />);

      expect(screen.getByText('999.999 kr')).toBeInTheDocument();
      expect(screen.getByText(/100 áskriftir/)).toBeInTheDocument();
    });

    it('should handle multiple categories at 100%', () => {
      const summary: SubscriptionSummary = {
        totalMonthly: 5000,
        totalYearly: 60000,
        lifeEnergyHoursPerMonth: 5,
        lifeEnergyHoursPerYear: 60,
        futureValueIn10Years: 500000,
        futureValueIn20Years: 1000000,
        byCategory: [
          {
            category: 'streaming',
            label: 'Streymi',
            totalMonthly: 5000,
            count: 1,
          },
        ],
      };

      mockUseCalculator.mockReturnValue({
        subscriptionSummary: summary,
      } as any);

      render(<SubscriptionCategoryBreakdown />);

      expect(screen.getByText('100%')).toBeInTheDocument();
    });
  });

  describe('Icelandic Text', () => {
    it('should display all text in Icelandic', () => {
      const summary: SubscriptionSummary = {
        totalMonthly: 8969,
        totalYearly: 107628,
        lifeEnergyHoursPerMonth: 5,
        lifeEnergyHoursPerYear: 60,
        futureValueIn10Years: 500000,
        futureValueIn20Years: 1000000,
        byCategory: [
          {
            category: 'streaming',
            label: 'Streymi',
            totalMonthly: 8969,
            count: 4,
          },
        ],
      };

      mockUseCalculator.mockReturnValue({
        subscriptionSummary: summary,
      } as any);

      render(<SubscriptionCategoryBreakdown />);

      expect(screen.getByText('Kostnaður eftir flokkum')).toBeInTheDocument();
      expect(screen.getByText(/áskriftir/)).toBeInTheDocument();
    });
  });
});
