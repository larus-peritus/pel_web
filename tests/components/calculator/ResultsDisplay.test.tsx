import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResultsDisplay } from '@/components/calculator/ResultsDisplay';
import { useCalculator } from '@/context/CalculatorContext';

// Mock the CalculatorContext
vi.mock('@/context/CalculatorContext', () => ({
  useCalculator: vi.fn(),
}));

describe('ResultsDisplay', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should show skeleton loader when not hydrated', () => {
      vi.mocked(useCalculator).mockReturnValue({
        results: null,
        isHydrated: false,
      } as any);

      render(<ResultsDisplay />);

      // Check for loading skeleton elements
      const skeletons = screen.getAllByRole('generic').filter(
        (el) => el.className.includes('animate-pulse')
      );
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should apply gradient background in loading state', () => {
      vi.mocked(useCalculator).mockReturnValue({
        results: null,
        isHydrated: false,
      } as any);

      const { container } = render(<ResultsDisplay />);
      const card = container.querySelector('.bg-gradient-to-br');

      expect(card).toBeTruthy();
      expect(card?.className).toContain('from-primary-50');
    });
  });

  describe('No Results State', () => {
    it('should show prompt message when hydrated but no results', () => {
      vi.mocked(useCalculator).mockReturnValue({
        results: null,
        isHydrated: true,
      } as any);

      render(<ResultsDisplay />);

      expect(
        screen.getByText('Sláðu inn tekjur til að sjá raunverulegt tímakaup þitt')
      ).toBeTruthy();
    });

    it('should not show loading skeleton when hydrated with no results', () => {
      vi.mocked(useCalculator).mockReturnValue({
        results: null,
        isHydrated: true,
      } as any);

      const { container } = render(<ResultsDisplay />);
      const skeleton = container.querySelector('.animate-pulse');

      expect(skeleton).toBeFalsy();
    });
  });

  describe('Results Display', () => {
    it('should display actual hourly wage prominently', () => {
      vi.mocked(useCalculator).mockReturnValue({
        results: {
          actualHourlyWage: 2550,
          nominalHourlyWage: 3000,
          percentageReduction: 15,
        },
        isHydrated: true,
      } as any);

      render(<ResultsDisplay />);

      // Check for formatted currency (ISK format)
      expect(screen.getByText('2.550 kr')).toBeTruthy();
      expect(screen.getByText('á klukkustund')).toBeTruthy();
    });

    it('should display nominal wage for comparison', () => {
      vi.mocked(useCalculator).mockReturnValue({
        results: {
          actualHourlyWage: 2500,
          nominalHourlyWage: 3000,
          percentageReduction: 16.67,
        },
        isHydrated: true,
      } as any);

      render(<ResultsDisplay />);

      expect(screen.getByText('Upphaflegt tímakaup')).toBeTruthy();
      expect(screen.getByText('3.000 kr')).toBeTruthy();
    });

    it('should display percentage reduction', () => {
      vi.mocked(useCalculator).mockReturnValue({
        results: {
          actualHourlyWage: 2000,
          nominalHourlyWage: 3000,
          percentageReduction: 33.3,
        },
        isHydrated: true,
      } as any);

      render(<ResultsDisplay />);

      expect(screen.getByText('-33.3%')).toBeTruthy();
    });

    it('should show reduction amount in insight message', () => {
      vi.mocked(useCalculator).mockReturnValue({
        results: {
          actualHourlyWage: 2000,
          nominalHourlyWage: 3000,
          percentageReduction: 33.3,
        },
        isHydrated: true,
      } as any);

      render(<ResultsDisplay />);

      // 3000 - 2000 = 1000
      expect(screen.getByText('1.000 kr')).toBeTruthy();
      expect(
        screen.getByText(/Vinnukostnaður og aukatími draga úr launum um/)
      ).toBeTruthy();
    });

    it('should not show insight message when reduction is 0', () => {
      vi.mocked(useCalculator).mockReturnValue({
        results: {
          actualHourlyWage: 3000,
          nominalHourlyWage: 3000,
          percentageReduction: 0,
        },
        isHydrated: true,
      } as any);

      render(<ResultsDisplay />);

      expect(
        screen.queryByText(/Vinnukostnaður og aukatími draga úr launum um/)
      ).toBeFalsy();
    });
  });

  describe('Badge Variants', () => {
    it('should use success variant for low reduction (< 15%)', () => {
      vi.mocked(useCalculator).mockReturnValue({
        results: {
          actualHourlyWage: 2700,
          nominalHourlyWage: 3000,
          percentageReduction: 10,
        },
        isHydrated: true,
      } as any);

      const { container } = render(<ResultsDisplay />);
      const badge = container.querySelector('.bg-success-50');

      expect(badge).toBeTruthy();
    });

    it('should use warning variant for medium reduction (15-30%)', () => {
      vi.mocked(useCalculator).mockReturnValue({
        results: {
          actualHourlyWage: 2400,
          nominalHourlyWage: 3000,
          percentageReduction: 20,
        },
        isHydrated: true,
      } as any);

      const { container } = render(<ResultsDisplay />);
      const badge = container.querySelector('.bg-warning-50');

      expect(badge).toBeTruthy();
    });

    it('should use danger variant for high reduction (> 30%)', () => {
      vi.mocked(useCalculator).mockReturnValue({
        results: {
          actualHourlyWage: 2000,
          nominalHourlyWage: 3000,
          percentageReduction: 33.3,
        },
        isHydrated: true,
      } as any);

      const { container } = render(<ResultsDisplay />);
      const badge = container.querySelector('.bg-danger-50');

      expect(badge).toBeTruthy();
    });
  });

  describe('Styling', () => {
    it('should have gradient background', () => {
      vi.mocked(useCalculator).mockReturnValue({
        results: {
          actualHourlyWage: 2500,
          nominalHourlyWage: 3000,
          percentageReduction: 16.67,
        },
        isHydrated: true,
      } as any);

      const { container } = render(<ResultsDisplay />);
      const card = container.querySelector('.bg-gradient-to-br');

      expect(card).toBeTruthy();
      expect(card?.className).toContain('from-primary-50');
      expect(card?.className).toContain('to-white');
    });

    it('should display title in header', () => {
      vi.mocked(useCalculator).mockReturnValue({
        results: {
          actualHourlyWage: 2500,
          nominalHourlyWage: 3000,
          percentageReduction: 16.67,
        },
        isHydrated: true,
      } as any);

      render(<ResultsDisplay />);

      const title = screen.getByText('Raunverulegt tímakaup þitt');
      expect(title).toBeTruthy();
      expect(title.tagName).toBe('H2');
    });

    it('should apply transition class for animations', () => {
      vi.mocked(useCalculator).mockReturnValue({
        results: {
          actualHourlyWage: 2500,
          nominalHourlyWage: 3000,
          percentageReduction: 16.67,
        },
        isHydrated: true,
      } as any);

      const { container } = render(<ResultsDisplay />);
      const wageDisplay = container.querySelector('.transition-all');

      expect(wageDisplay).toBeTruthy();
      expect(wageDisplay?.className).toContain('duration-300');
    });
  });

  describe('Currency Formatting', () => {
    it('should format actual wage as whole ISK amount', () => {
      vi.mocked(useCalculator).mockReturnValue({
        results: {
          actualHourlyWage: 2555.55,
          nominalHourlyWage: 3099.99,
          percentageReduction: 17.6,
        },
        isHydrated: true,
      } as any);

      render(<ResultsDisplay />);

      // ISK should be formatted as whole numbers
      expect(screen.getByText('2.556 kr')).toBeTruthy();
      expect(screen.getByText('3.100 kr')).toBeTruthy();
    });

    it('should format percentage with 1 decimal place', () => {
      vi.mocked(useCalculator).mockReturnValue({
        results: {
          actualHourlyWage: 2500,
          nominalHourlyWage: 3000,
          percentageReduction: 16.666667,
        },
        isHydrated: true,
      } as any);

      render(<ResultsDisplay />);

      expect(screen.getByText('-16.7%')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero actual wage', () => {
      vi.mocked(useCalculator).mockReturnValue({
        results: {
          actualHourlyWage: 0,
          nominalHourlyWage: 3000,
          percentageReduction: 100,
        },
        isHydrated: true,
      } as any);

      render(<ResultsDisplay />);

      expect(screen.getByText('0 kr')).toBeTruthy();
      expect(screen.getByText('-100.0%')).toBeTruthy();
    });

    it('should handle identical actual and nominal wages', () => {
      vi.mocked(useCalculator).mockReturnValue({
        results: {
          actualHourlyWage: 3000,
          nominalHourlyWage: 3000,
          percentageReduction: 0,
        },
        isHydrated: true,
      } as any);

      render(<ResultsDisplay />);

      expect(screen.getAllByText('3.000 kr').length).toBe(2);
      expect(screen.getByText('-0.0%')).toBeTruthy();
    });

    it('should handle large ISK wages', () => {
      vi.mocked(useCalculator).mockReturnValue({
        results: {
          actualHourlyWage: 15075,
          nominalHourlyWage: 20000,
          percentageReduction: 24.625,
        },
        isHydrated: true,
      } as any);

      render(<ResultsDisplay />);

      expect(screen.getByText('15.075 kr')).toBeTruthy();
      expect(screen.getByText('20.000 kr')).toBeTruthy();
    });
  });
});
