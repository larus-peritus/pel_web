import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QuickStats } from '@/components/savingsReport/QuickStats';
import type { SavingsReportResults } from '@/types/savingsReport';

describe('QuickStats', () => {
  const mockResultsBasic: SavingsReportResults = {
    totalSavings: 5000000,
    totalMonthlyContribution: 150000,
    totalAnnualContribution: 1800000,
    savingsRate: null,
    savingsRateContext: null,
    categoryBreakdown: [],
    lifeEnergy: null,
  };

  const mockResultsWithRate: SavingsReportResults = {
    ...mockResultsBasic,
    savingsRate: 30,
    savingsRateContext: {
      rate: 30,
      level: 'moderate',
      messageIs: 'Góður grunnur',
      fiEstimateYears: 30,
    },
  };

  const mockResultsWithLifeEnergy: SavingsReportResults = {
    ...mockResultsWithRate,
    lifeEnergy: {
      totalBalanceHours: 2000,
      totalContributionHoursPerMonth: 60,
      totalContributionHoursPerYear: 720,
    },
  };

  describe('Basic Rendering', () => {
    it('should render total savings card', () => {
      render(<QuickStats results={mockResultsBasic} />);

      expect(screen.getByText('Heildarsparnaður')).toBeTruthy();
      expect(screen.getByText('5.000.000 kr')).toBeTruthy();
      expect(screen.getByText('Samtals í öllum flokkum')).toBeTruthy();
    });

    it('should render monthly contribution card', () => {
      render(<QuickStats results={mockResultsBasic} />);

      expect(screen.getByText('Mánaðarleg framlög')).toBeTruthy();
      expect(screen.getByText('150.000 kr')).toBeTruthy();
      expect(screen.getByText('Samtals á mánuði')).toBeTruthy();
    });
  });

  describe('Conditional Rendering', () => {
    it('should not render savings rate card when rate is null', () => {
      render(<QuickStats results={mockResultsBasic} />);

      expect(screen.queryByText('Sparnaðarhlutfall')).toBeNull();
    });

    it('should render savings rate card when rate is available', () => {
      render(<QuickStats results={mockResultsWithRate} />);

      expect(screen.getByText('Sparnaðarhlutfall')).toBeTruthy();
      expect(screen.getByText('30,0%')).toBeTruthy();
      expect(screen.getByText('Af tekjum')).toBeTruthy();
    });

    it('should not render life energy card when not available', () => {
      render(<QuickStats results={mockResultsBasic} />);

      expect(screen.queryByText('Lífsorka')).toBeNull();
    });

    it('should render life energy card when available', () => {
      render(<QuickStats results={mockResultsWithLifeEnergy} />);

      expect(screen.getByText('Lífsorka')).toBeTruthy();
      expect(screen.getByText('2.000 klst')).toBeTruthy();
      expect(screen.getByText('Heildar vinnustundir')).toBeTruthy();
    });
  });

  describe('Layout', () => {
    it('should use responsive grid layout', () => {
      const { container } = render(<QuickStats results={mockResultsBasic} />);

      const gridContainer = container.querySelector('.grid');
      expect(gridContainer?.classList.contains('grid-cols-1')).toBe(true);
      expect(gridContainer?.classList.contains('md:grid-cols-2')).toBe(true);
      expect(gridContainer?.classList.contains('lg:grid-cols-4')).toBe(true);
    });

    it('should show 2 cards when only basic data available', () => {
      render(<QuickStats results={mockResultsBasic} />);

      // Check for the two card headings that are always shown
      expect(screen.getByText('Heildarsparnaður')).toBeTruthy();
      expect(screen.getByText('Mánaðarleg framlög')).toBeTruthy();

      // Should not show conditional cards
      expect(screen.queryByText('Sparnaðarhlutfall')).toBeNull();
      expect(screen.queryByText('Lífsorka')).toBeNull();
    });

    it('should show 4 cards when all data available', () => {
      render(<QuickStats results={mockResultsWithLifeEnergy} />);

      // Check for all four card headings
      expect(screen.getByText('Heildarsparnaður')).toBeTruthy();
      expect(screen.getByText('Mánaðarleg framlög')).toBeTruthy();
      expect(screen.getByText('Sparnaðarhlutfall')).toBeTruthy();
      expect(screen.getByText('Lífsorka')).toBeTruthy();
    });
  });

  describe('Formatting', () => {
    it('should format currency with Icelandic separators', () => {
      render(<QuickStats results={mockResultsBasic} />);

      // Check for period separator in ISK formatting
      expect(screen.getByText('5.000.000 kr')).toBeTruthy();
      expect(screen.getByText('150.000 kr')).toBeTruthy();
    });

    it('should format savings rate with 1 decimal place', () => {
      render(<QuickStats results={mockResultsWithRate} />);

      expect(screen.getByText('30,0%')).toBeTruthy();
    });

    it('should format life energy hours without decimals', () => {
      render(<QuickStats results={mockResultsWithLifeEnergy} />);

      expect(screen.getByText('2.000 klst')).toBeTruthy();
    });
  });

  describe('Color Themes', () => {
    it('should use primary gradient for total savings', () => {
      const { container } = render(<QuickStats results={mockResultsBasic} />);

      // Find card content with Heildarsparnaður and check its gradient classes
      const cardElement = screen.getByText('Heildarsparnaður').closest('div');
      const cardWithGradient = cardElement?.parentElement?.parentElement;
      expect(cardWithGradient?.className).toContain('from-primary-50');
    });

    it('should use success gradient for monthly contribution', () => {
      const { container } = render(<QuickStats results={mockResultsBasic} />);

      const cardElement = screen.getByText('Mánaðarleg framlög').closest('div');
      const cardWithGradient = cardElement?.parentElement?.parentElement;
      expect(cardWithGradient?.className).toContain('from-success-50');
    });

    it('should use amber gradient for savings rate', () => {
      render(<QuickStats results={mockResultsWithRate} />);

      const cardElement = screen.getByText('Sparnaðarhlutfall').closest('div');
      const cardWithGradient = cardElement?.parentElement?.parentElement;
      expect(cardWithGradient?.className).toContain('from-amber-50');
    });

    it('should use purple gradient for life energy', () => {
      render(<QuickStats results={mockResultsWithLifeEnergy} />);

      const cardElement = screen.getByText('Lífsorka').closest('div');
      const cardWithGradient = cardElement?.parentElement?.parentElement;
      expect(cardWithGradient?.className).toContain('from-purple-50');
    });
  });
});
