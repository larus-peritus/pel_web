import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SavingsRateInsights } from '@/components/savingsReport/SavingsRateInsights';
import type { SavingsReportResults } from '@/types/savingsReport';

describe('SavingsRateInsights', () => {
  const mockResultsNoIncome: SavingsReportResults = {
    totalSavings: 5000000,
    totalMonthlyContribution: 150000,
    totalAnnualContribution: 1800000,
    savingsRate: null,
    savingsRateContext: null,
    categoryBreakdown: [],
    lifeEnergy: null,
  };

  const mockResultsCritical: SavingsReportResults = {
    ...mockResultsNoIncome,
    savingsRate: 5,
    savingsRateContext: {
      rate: 5,
      level: 'critical',
      messageIs: 'Mjög lágur sparnaður - erfiðleikar með að ná fjárhagsfrelsi.',
      fiEstimateYears: null,
    },
  };

  const mockResultsModerate: SavingsReportResults = {
    ...mockResultsNoIncome,
    savingsRate: 25,
    savingsRateContext: {
      rate: 25,
      level: 'moderate',
      messageIs: 'Góður grunnur - þetta er í kringum meðaltal Íslendinga.',
      fiEstimateYears: 30,
    },
  };

  const mockResultsExcellent: SavingsReportResults = {
    ...mockResultsNoIncome,
    savingsRate: 55,
    savingsRateContext: {
      rate: 55,
      level: 'excellent',
      messageIs: 'Framúrskarandi! Með þessum hraða gætirðu náð fjárhagsfrelsi á 10-15 árum.',
      fiEstimateYears: 12,
    },
  };

  describe('Missing Income State', () => {
    it('should render info alert when no income data', () => {
      render(<SavingsRateInsights results={mockResultsNoIncome} />);

      expect(screen.getByText('Sparnaðarhlutfall')).toBeTruthy();
      expect(
        screen.getByText(/Fylltu út tekjur í/i)
      ).toBeTruthy();
      expect(
        screen.getByText(/til að sjá sparnaðarhlutfall og fjárhagsfrelsis áætlun/i)
      ).toBeTruthy();
    });

    it('should have link to calculator', () => {
      render(<SavingsRateInsights results={mockResultsNoIncome} />);

      const link = screen.getByRole('link', { name: /reiknivélinni/i });
      expect(link).toBeTruthy();
      expect(link.getAttribute('href')).toBe('/');
    });
  });

  describe('Savings Rate Display', () => {
    it('should display savings rate percentage', () => {
      render(<SavingsRateInsights results={mockResultsModerate} />);

      expect(screen.getByText('25,0%')).toBeTruthy();
    });

    it('should display "Þú sparar" label', () => {
      render(<SavingsRateInsights results={mockResultsModerate} />);

      expect(screen.getByText('Þú sparar')).toBeTruthy();
      expect(screen.getByText('af tekjum þínum')).toBeTruthy();
    });

    it('should format rate with 1 decimal place', () => {
      render(<SavingsRateInsights results={mockResultsModerate} />);

      expect(screen.getByText('25,0%')).toBeTruthy();
    });
  });

  describe('Context Message', () => {
    it('should display context message', () => {
      render(<SavingsRateInsights results={mockResultsModerate} />);

      expect(
        screen.getByText('Góður grunnur - þetta er í kringum meðaltal Íslendinga.')
      ).toBeTruthy();
    });

    it('should display critical level message', () => {
      render(<SavingsRateInsights results={mockResultsCritical} />);

      expect(
        screen.getByText(/Mjög lágur sparnaður - erfiðleikar með að ná fjárhagsfrelsi/)
      ).toBeTruthy();
    });

    it('should display excellent level message', () => {
      render(<SavingsRateInsights results={mockResultsExcellent} />);

      expect(
        screen.getByText(/Framúrskarandi! Með þessum hraða gætirðu náð fjárhagsfrelsi/)
      ).toBeTruthy();
    });
  });

  describe('FI Estimate', () => {
    it('should not show FI estimate when null', () => {
      render(<SavingsRateInsights results={mockResultsCritical} />);

      expect(screen.queryByText(/Áætluð leið til fjárhagsfrelsis/)).toBeNull();
    });

    it('should show FI estimate when available', () => {
      render(<SavingsRateInsights results={mockResultsModerate} />);

      expect(screen.getByText('Áætluð leið til fjárhagsfrelsis')).toBeTruthy();
      expect(screen.getByText(/30 árum/)).toBeTruthy();
    });

    it('should display correct estimate years', () => {
      render(<SavingsRateInsights results={mockResultsExcellent} />);

      expect(screen.getByText(/12 árum/)).toBeTruthy();
    });

    it('should have target icon in FI estimate', () => {
      render(<SavingsRateInsights results={mockResultsModerate} />);

      expect(screen.getByText('🎯')).toBeTruthy();
    });
  });

  describe('Color Coding', () => {
    it('should use danger colors for critical level', () => {
      const { container } = render(<SavingsRateInsights results={mockResultsCritical} />);

      const rateDisplay = screen.getByText('5,0%').closest('div');
      expect(rateDisplay?.classList.contains('text-danger-700')).toBe(true);
    });

    it('should use amber colors for moderate level', () => {
      const { container } = render(<SavingsRateInsights results={mockResultsModerate} />);

      const rateDisplay = screen.getByText('25,0%').closest('div');
      expect(rateDisplay?.classList.contains('text-amber-700')).toBe(true);
    });

    it('should use blue colors for excellent level', () => {
      const { container } = render(<SavingsRateInsights results={mockResultsExcellent} />);

      const rateDisplay = screen.getByText('55,0%').closest('div');
      expect(rateDisplay?.classList.contains('text-blue-700')).toBe(true);
    });
  });

  describe('Layout', () => {
    it('should have proper card structure', () => {
      render(<SavingsRateInsights results={mockResultsModerate} />);

      const heading = screen.getByText('Sparnaðarhlutfall');
      expect(heading.tagName).toBe('H3');
    });

    it('should have multiple sections when data available', () => {
      const { container } = render(<SavingsRateInsights results={mockResultsModerate} />);

      // Rate display, context message, and FI estimate
      const sections = container.querySelectorAll('.rounded-xl, .rounded-lg');
      expect(sections.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Accessibility', () => {
    it('should have semantic heading', () => {
      render(<SavingsRateInsights results={mockResultsModerate} />);

      const heading = screen.getByRole('heading', { name: 'Sparnaðarhlutfall' });
      expect(heading).toBeTruthy();
    });

    it('should have accessible link in no-income state', () => {
      render(<SavingsRateInsights results={mockResultsNoIncome} />);

      const link = screen.getByRole('link');
      expect(link.getAttribute('href')).toBe('/');
    });
  });
});
