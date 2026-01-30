import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CategoryBreakdownChart } from '@/components/savingsReport/CategoryBreakdownChart';
import type { CategoryBreakdown } from '@/types/savingsReport';

describe('CategoryBreakdownChart', () => {
  const mockCategoryBreakdown: CategoryBreakdown[] = [
    {
      categoryId: 'neydarsjodur',
      categoryName: 'Neyðarsjóður',
      icon: '🛡️',
      balance: 2000000,
      monthlyContribution: 50000,
      percentageOfTotal: 40,
      lifeEnergyBalance: 800,
      lifeEnergyContribution: 20,
    },
    {
      categoryId: 'fjarfestingar',
      categoryName: 'Fjárfestingar',
      icon: '📈',
      balance: 3000000,
      monthlyContribution: 100000,
      percentageOfTotal: 60,
      lifeEnergyBalance: 1200,
      lifeEnergyContribution: 40,
    },
  ];

  const mockEmptyBreakdown: CategoryBreakdown[] = [];

  const mockZeroBalanceBreakdown: CategoryBreakdown[] = [
    {
      categoryId: 'neydarsjodur',
      categoryName: 'Neyðarsjóður',
      icon: '🛡️',
      balance: 0,
      monthlyContribution: 0,
      percentageOfTotal: 0,
    },
  ];

  describe('Empty State', () => {
    it('should render empty state when no categories', () => {
      render(<CategoryBreakdownChart categoryBreakdown={mockEmptyBreakdown} />);

      expect(screen.getByText('Skipting eftir flokkum')).toBeTruthy();
      expect(screen.getByText('Enginn sparnaður skráður')).toBeTruthy();
    });

    it('should render empty state when all categories have zero balance', () => {
      render(<CategoryBreakdownChart categoryBreakdown={mockZeroBalanceBreakdown} />);

      expect(screen.getByText('Enginn sparnaður skráður')).toBeTruthy();
    });
  });

  describe('Chart Rendering', () => {
    it('should render chart with data', () => {
      const { container } = render(
        <CategoryBreakdownChart categoryBreakdown={mockCategoryBreakdown} />
      );

      expect(screen.getByText('Skipting eftir flokkum')).toBeTruthy();

      // Chart should be rendered - check for ResponsiveContainer
      // Recharts might not render SVG in test environment, so check for the wrapper
      const chartContainer = container.querySelector('.recharts-wrapper, .recharts-responsive-container');
      expect(chartContainer).toBeTruthy();
    });

    it('should filter out categories with 0 balance', () => {
      const mixedData: CategoryBreakdown[] = [
        ...mockCategoryBreakdown,
        {
          categoryId: 'empty',
          categoryName: 'Empty',
          icon: '📦',
          balance: 0,
          monthlyContribution: 0,
          percentageOfTotal: 0,
        },
      ];

      render(<CategoryBreakdownChart categoryBreakdown={mixedData} />);

      // Should not show the empty category
      expect(screen.queryByText('Empty')).toBeNull();

      // Should show the non-empty ones
      expect(screen.getByText(/Neyðarsjóður/)).toBeTruthy();
      expect(screen.getByText(/Fjárfestingar/)).toBeTruthy();
    });
  });

  describe('Legend', () => {
    it('should display legend with all categories', () => {
      render(<CategoryBreakdownChart categoryBreakdown={mockCategoryBreakdown} />);

      expect(screen.getByText(/🛡️ Neyðarsjóður/)).toBeTruthy();
      expect(screen.getByText(/📈 Fjárfestingar/)).toBeTruthy();
    });

    it('should display percentages in legend', () => {
      render(<CategoryBreakdownChart categoryBreakdown={mockCategoryBreakdown} />);

      expect(screen.getByText('40,0%')).toBeTruthy();
      expect(screen.getByText('60,0%')).toBeTruthy();
    });

    it('should use color indicators in legend', () => {
      const { container } = render(
        <CategoryBreakdownChart categoryBreakdown={mockCategoryBreakdown} />
      );

      const colorDots = container.querySelectorAll('.w-2\\.5.h-2\\.5.rounded-full');
      expect(colorDots.length).toBe(2);
    });

    it('should have scrollable legend with max height', () => {
      const { container } = render(
        <CategoryBreakdownChart categoryBreakdown={mockCategoryBreakdown} />
      );

      const legend = container.querySelector('.max-h-32.overflow-y-auto');
      expect(legend).toBeTruthy();
    });
  });

  describe('Formatting', () => {
    it('should format percentages with 1 decimal place', () => {
      render(<CategoryBreakdownChart categoryBreakdown={mockCategoryBreakdown} />);

      expect(screen.getByText('40,0%')).toBeTruthy();
      expect(screen.getByText('60,0%')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(<CategoryBreakdownChart categoryBreakdown={mockCategoryBreakdown} />);

      const heading = screen.getByText('Skipting eftir flokkum');
      expect(heading.tagName).toBe('H3');
    });
  });
});
