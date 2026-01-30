import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SubscriptionSummary } from '@/components/subscriptions/SubscriptionSummary';
import { useCalculator } from '@/context/CalculatorContext';
import type { SubscriptionSummary as SubscriptionSummaryType } from '@/types/calculator';

// Mock the CalculatorContext
vi.mock('@/context/CalculatorContext', () => ({
  useCalculator: vi.fn(),
}));

describe('SubscriptionSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('No Subscriptions State', () => {
    it('should not render when no subscriptions exist', () => {
      vi.mocked(useCalculator).mockReturnValue({
        subscriptionSummary: null,
        results: {
          actualHourlyWage: 2500,
        },
      } as any);

      const { container } = render(<SubscriptionSummary />);
      expect(container.firstChild).toBeNull();
    });

    it('should not render when total monthly is 0', () => {
      vi.mocked(useCalculator).mockReturnValue({
        subscriptionSummary: {
          totalMonthly: 0,
          totalYearly: 0,
          lifeEnergyHoursPerMonth: 0,
          lifeEnergyHoursPerYear: 0,
          futureValueIn10Years: 0,
          futureValueIn20Years: 0,
          byCategory: [],
        } as SubscriptionSummaryType,
        results: {
          actualHourlyWage: 2500,
        },
      } as any);

      const { container } = render(<SubscriptionSummary />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Warning Message', () => {
    it('should show warning when no actual wage is available', () => {
      vi.mocked(useCalculator).mockReturnValue({
        subscriptionSummary: {
          totalMonthly: 5000,
          totalYearly: 60000,
          lifeEnergyHoursPerMonth: 10,
          lifeEnergyHoursPerYear: 120,
          futureValueIn10Years: 500000,
          futureValueIn20Years: 1200000,
          byCategory: [],
        } as SubscriptionSummaryType,
        results: null,
      } as any);

      render(<SubscriptionSummary />);

      expect(
        screen.getByText('Fylltu fyrst út Raunverulegt Tímakaup reiknivélina til að sjá lífsorku kostnað')
      ).toBeTruthy();
    });

    it('should show warning when actual wage is 0', () => {
      vi.mocked(useCalculator).mockReturnValue({
        subscriptionSummary: {
          totalMonthly: 5000,
          totalYearly: 60000,
          lifeEnergyHoursPerMonth: 10,
          lifeEnergyHoursPerYear: 120,
          futureValueIn10Years: 500000,
          futureValueIn20Years: 1200000,
          byCategory: [],
        } as SubscriptionSummaryType,
        results: {
          actualHourlyWage: 0,
        },
      } as any);

      render(<SubscriptionSummary />);

      expect(
        screen.getByText('Fylltu fyrst út Raunverulegt Tímakaup reiknivélina til að sjá lífsorku kostnað')
      ).toBeTruthy();
    });

    it('should not show warning when actual wage is valid', () => {
      vi.mocked(useCalculator).mockReturnValue({
        subscriptionSummary: {
          totalMonthly: 5000,
          totalYearly: 60000,
          lifeEnergyHoursPerMonth: 2,
          lifeEnergyHoursPerYear: 24,
          futureValueIn10Years: 500000,
          futureValueIn20Years: 1200000,
          byCategory: [],
        } as SubscriptionSummaryType,
        results: {
          actualHourlyWage: 2500,
        },
      } as any);

      render(<SubscriptionSummary />);

      expect(
        screen.queryByText('Fylltu fyrst út Raunverulegt Tímakaup reiknivélina til að sjá lífsorku kostnað')
      ).toBeFalsy();
    });
  });

  describe('Monthly and Yearly Costs', () => {
    it('should display monthly cost correctly', () => {
      vi.mocked(useCalculator).mockReturnValue({
        subscriptionSummary: {
          totalMonthly: 15678,
          totalYearly: 188136,
          lifeEnergyHoursPerMonth: 10,
          lifeEnergyHoursPerYear: 120,
          futureValueIn10Years: 500000,
          futureValueIn20Years: 1200000,
          byCategory: [],
        } as SubscriptionSummaryType,
        results: {
          actualHourlyWage: 2500,
        },
      } as any);

      render(<SubscriptionSummary />);

      expect(screen.getByText('Mánaðarlega')).toBeTruthy();
      expect(screen.getByText('15.678 kr')).toBeTruthy();
    });

    it('should display yearly cost correctly', () => {
      vi.mocked(useCalculator).mockReturnValue({
        subscriptionSummary: {
          totalMonthly: 5000,
          totalYearly: 60000,
          lifeEnergyHoursPerMonth: 10,
          lifeEnergyHoursPerYear: 120,
          futureValueIn10Years: 500000,
          futureValueIn20Years: 1200000,
          byCategory: [],
        } as SubscriptionSummaryType,
        results: {
          actualHourlyWage: 2500,
        },
      } as any);

      render(<SubscriptionSummary />);

      expect(screen.getByText('Árlega')).toBeTruthy();
      expect(screen.getByText('60.000 kr')).toBeTruthy();
    });
  });

  describe('Life Energy Display', () => {
    it('should display life energy per month when wage is available', () => {
      vi.mocked(useCalculator).mockReturnValue({
        subscriptionSummary: {
          totalMonthly: 5000,
          totalYearly: 60000,
          lifeEnergyHoursPerMonth: 2.5,
          lifeEnergyHoursPerYear: 30,
          futureValueIn10Years: 500000,
          futureValueIn20Years: 1200000,
          byCategory: [],
        } as SubscriptionSummaryType,
        results: {
          actualHourlyWage: 2000,
        },
      } as any);

      render(<SubscriptionSummary />);

      expect(screen.getByText('Lífsorka á mánuði')).toBeTruthy();
      expect(screen.getByText('2 klst 30 mín')).toBeTruthy();
    });

    it('should display life energy per year in hours when less than 24 hours', () => {
      vi.mocked(useCalculator).mockReturnValue({
        subscriptionSummary: {
          totalMonthly: 5000,
          totalYearly: 60000,
          lifeEnergyHoursPerMonth: 2,
          lifeEnergyHoursPerYear: 20,
          futureValueIn10Years: 500000,
          futureValueIn20Years: 1200000,
          byCategory: [],
        } as SubscriptionSummaryType,
        results: {
          actualHourlyWage: 3000,
        },
      } as any);

      render(<SubscriptionSummary />);

      expect(screen.getByText('Lífsorka á ári')).toBeTruthy();
      expect(screen.getByText('20 klukkustundir')).toBeTruthy();
    });

    it('should display life energy per year in days when 24+ hours', () => {
      vi.mocked(useCalculator).mockReturnValue({
        subscriptionSummary: {
          totalMonthly: 10000,
          totalYearly: 120000,
          lifeEnergyHoursPerMonth: 5,
          lifeEnergyHoursPerYear: 48,
          futureValueIn10Years: 1000000,
          futureValueIn20Years: 2400000,
          byCategory: [],
        } as SubscriptionSummaryType,
        results: {
          actualHourlyWage: 2500,
        },
      } as any);

      render(<SubscriptionSummary />);

      // 48 hours / 8 = 6 days
      expect(screen.getByText('6 dagar')).toBeTruthy();
    });

    it('should not display life energy when wage is not available', () => {
      vi.mocked(useCalculator).mockReturnValue({
        subscriptionSummary: {
          totalMonthly: 5000,
          totalYearly: 60000,
          lifeEnergyHoursPerMonth: 0,
          lifeEnergyHoursPerYear: 0,
          futureValueIn10Years: 500000,
          futureValueIn20Years: 1200000,
          byCategory: [],
        } as SubscriptionSummaryType,
        results: null,
      } as any);

      render(<SubscriptionSummary />);

      expect(screen.queryByText('Lífsorka kostnaður')).toBeFalsy();
      expect(screen.queryByText('Lífsorka á mánuði')).toBeFalsy();
    });
  });

  describe('Future Value Display', () => {
    it('should display 10-year future value when wage is available', () => {
      vi.mocked(useCalculator).mockReturnValue({
        subscriptionSummary: {
          totalMonthly: 5000,
          totalYearly: 60000,
          lifeEnergyHoursPerMonth: 2,
          lifeEnergyHoursPerYear: 24,
          futureValueIn10Years: 863000,
          futureValueIn20Years: 2460000,
          byCategory: [],
        } as SubscriptionSummaryType,
        results: {
          actualHourlyWage: 2500,
        },
      } as any);

      render(<SubscriptionSummary />);

      expect(screen.getByText('Ef fjárfest í 10 ár')).toBeTruthy();
      expect(screen.getByText('863.000 kr')).toBeTruthy();
    });

    it('should display 20-year future value when wage is available', () => {
      vi.mocked(useCalculator).mockReturnValue({
        subscriptionSummary: {
          totalMonthly: 5000,
          totalYearly: 60000,
          lifeEnergyHoursPerMonth: 2,
          lifeEnergyHoursPerYear: 24,
          futureValueIn10Years: 863000,
          futureValueIn20Years: 2460000,
          byCategory: [],
        } as SubscriptionSummaryType,
        results: {
          actualHourlyWage: 2500,
        },
      } as any);

      render(<SubscriptionSummary />);

      expect(screen.getByText('Ef fjárfest í 20 ár')).toBeTruthy();
      expect(screen.getByText('2.460.000 kr')).toBeTruthy();
    });

    it('should show 7% return rate disclaimer', () => {
      vi.mocked(useCalculator).mockReturnValue({
        subscriptionSummary: {
          totalMonthly: 5000,
          totalYearly: 60000,
          lifeEnergyHoursPerMonth: 2,
          lifeEnergyHoursPerYear: 24,
          futureValueIn10Years: 863000,
          futureValueIn20Years: 2460000,
          byCategory: [],
        } as SubscriptionSummaryType,
        results: {
          actualHourlyWage: 2500,
        },
      } as any);

      render(<SubscriptionSummary />);

      expect(screen.getByText('Miðað við 7% ársávöxtun')).toBeTruthy();
      expect(screen.getByText('Ef fjárfest í staðinn')).toBeTruthy();
    });

    it('should not display future value when wage is not available', () => {
      vi.mocked(useCalculator).mockReturnValue({
        subscriptionSummary: {
          totalMonthly: 5000,
          totalYearly: 60000,
          lifeEnergyHoursPerMonth: 0,
          lifeEnergyHoursPerYear: 0,
          futureValueIn10Years: 863000,
          futureValueIn20Years: 2460000,
          byCategory: [],
        } as SubscriptionSummaryType,
        results: null,
      } as any);

      render(<SubscriptionSummary />);

      expect(screen.queryByText('Ef fjárfest í 10 ár')).toBeFalsy();
      expect(screen.queryByText('Ef fjárfest í 20 ár')).toBeFalsy();
    });
  });

  describe('Header and Styling', () => {
    it('should display header title', () => {
      vi.mocked(useCalculator).mockReturnValue({
        subscriptionSummary: {
          totalMonthly: 5000,
          totalYearly: 60000,
          lifeEnergyHoursPerMonth: 2,
          lifeEnergyHoursPerYear: 24,
          futureValueIn10Years: 500000,
          futureValueIn20Years: 1200000,
          byCategory: [],
        } as SubscriptionSummaryType,
        results: {
          actualHourlyWage: 2500,
        },
      } as any);

      render(<SubscriptionSummary />);

      expect(screen.getByText('Heildaráskriftir')).toBeTruthy();
    });

    it('should have gradient background in header', () => {
      vi.mocked(useCalculator).mockReturnValue({
        subscriptionSummary: {
          totalMonthly: 5000,
          totalYearly: 60000,
          lifeEnergyHoursPerMonth: 2,
          lifeEnergyHoursPerYear: 24,
          futureValueIn10Years: 500000,
          futureValueIn20Years: 1200000,
          byCategory: [],
        } as SubscriptionSummaryType,
        results: {
          actualHourlyWage: 2500,
        },
      } as any);

      const { container } = render(<SubscriptionSummary />);
      const header = container.querySelector('.bg-gradient-to-r');

      expect(header).toBeTruthy();
      expect(header?.className).toContain('from-warning-50');
      expect(header?.className).toContain('to-primary-50');
    });

    it('should apply custom className when provided', () => {
      vi.mocked(useCalculator).mockReturnValue({
        subscriptionSummary: {
          totalMonthly: 5000,
          totalYearly: 60000,
          lifeEnergyHoursPerMonth: 2,
          lifeEnergyHoursPerYear: 24,
          futureValueIn10Years: 500000,
          futureValueIn20Years: 1200000,
          byCategory: [],
        } as SubscriptionSummaryType,
        results: {
          actualHourlyWage: 2500,
        },
      } as any);

      const { container } = render(<SubscriptionSummary className="custom-class" />);
      const card = container.querySelector('.custom-class');

      expect(card).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle large subscription amounts', () => {
      vi.mocked(useCalculator).mockReturnValue({
        subscriptionSummary: {
          totalMonthly: 125000,
          totalYearly: 1500000,
          lifeEnergyHoursPerMonth: 50,
          lifeEnergyHoursPerYear: 600,
          futureValueIn10Years: 21521000,
          futureValueIn20Years: 61520000,
          byCategory: [],
        } as SubscriptionSummaryType,
        results: {
          actualHourlyWage: 2500,
        },
      } as any);

      render(<SubscriptionSummary />);

      expect(screen.getByText('125.000 kr')).toBeTruthy();
      expect(screen.getByText('1.500.000 kr')).toBeTruthy();
      // 600 hours / 8 = 75 days
      expect(screen.getByText('75 dagar')).toBeTruthy();
    });

    it('should handle small subscription amounts', () => {
      vi.mocked(useCalculator).mockReturnValue({
        subscriptionSummary: {
          totalMonthly: 500,
          totalYearly: 6000,
          lifeEnergyHoursPerMonth: 0.2,
          lifeEnergyHoursPerYear: 2.4,
          futureValueIn10Years: 86000,
          futureValueIn20Years: 246000,
          byCategory: [],
        } as SubscriptionSummaryType,
        results: {
          actualHourlyWage: 2500,
        },
      } as any);

      render(<SubscriptionSummary />);

      expect(screen.getByText('500 kr')).toBeTruthy();
      expect(screen.getByText('6.000 kr')).toBeTruthy();
      expect(screen.getByText('12 mínútur')).toBeTruthy();
    });
  });
});
