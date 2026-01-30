import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ComparisonCards } from '@/components/fireTypes/ComparisonCards';
import type { FIRECalculation } from '@/types/fireTypes';

describe('ComparisonCards Component', () => {
  const mockCalculations = {
    leanfire: {
      fireTypeId: 'leanfire' as const,
      monthlyExpenses: 250000,
      annualExpenses: 3000000,
      multiplier: 25,
      fiNumber: 75000000,
      yearsToFI: 12.5,
      monthsToFI: 150,
      targetDate: new Date('2037-06-29'),
      targetAge: 50,
      currentProgress: 20,
      amountRemaining: 60000000,
      effortLevel: 'high' as const,
      feasibility: 75,
    },
    regularfire: {
      fireTypeId: 'regularfire' as const,
      monthlyExpenses: 520000,
      annualExpenses: 6240000,
      multiplier: 30,
      fiNumber: 187200000,
      yearsToFI: 18.2,
      monthsToFI: 218,
      targetDate: new Date('2044-03-29'),
      targetAge: 56,
      currentProgress: 15,
      amountRemaining: 159120000,
      effortLevel: 'moderate' as const,
      feasibility: 82,
    },
    coastfire: {
      fireTypeId: 'coastfire' as const,
      monthlyExpenses: 520000,
      annualExpenses: 6240000,
      multiplier: 30,
      fiNumber: 80000000,
      yearsToFI: 8.5,
      monthsToFI: 102,
      targetDate: new Date('2033-12-29'),
      targetAge: 46,
      currentProgress: 35,
      amountRemaining: 52000000,
      effortLevel: 'moderate' as const,
      feasibility: 88,
      coastData: {
        coastFINumber: 80000000,
        isCoasting: false,
        yearsUntilCoast: 8.5,
        coastDate: new Date('2033-12-29'),
        workIncomeNeeded: 520000,
      },
    },
    baristafire: {
      fireTypeId: 'baristafire' as const,
      monthlyExpenses: 520000,
      annualExpenses: 6240000,
      multiplier: 30,
      fiNumber: 120000000,
      yearsToFI: 14.0,
      monthsToFI: 168,
      targetDate: new Date('2039-01-29'),
      targetAge: 52,
      currentProgress: 25,
      amountRemaining: 90000000,
      effortLevel: 'moderate' as const,
      feasibility: 79,
      baristaData: {
        partTimeIncomeNeeded: 200000,
        hoursPerWeekNeeded: 15,
        reducedFINumber: 120000000,
        fullFINumber: 187200000,
        savings: 67200000,
      },
    },
    fatfire: {
      fireTypeId: 'fatfire' as const,
      monthlyExpenses: 1000000,
      annualExpenses: 12000000,
      multiplier: 30,
      fiNumber: 360000000,
      yearsToFI: 28.0,
      monthsToFI: 336,
      targetDate: new Date('2053-01-29'),
      targetAge: 66,
      currentProgress: 8,
      amountRemaining: 331200000,
      effortLevel: 'extreme' as const,
      feasibility: 45,
    },
  } as Record<string, FIRECalculation>;

  const mockOnSelectType = vi.fn();

  beforeEach(() => {
    mockOnSelectType.mockClear();
  });

  describe('Card Structure', () => {
    it('renders all 5 FIRE type cards', () => {
      render(
        <ComparisonCards
          calculations={mockCalculations}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      expect(screen.getByText('Sparsamt FIRE')).toBeInTheDocument();
      expect(screen.getByText('Venjulegt FIRE')).toBeInTheDocument();
      expect(screen.getByText('Sjálfvirkt FIRE')).toBeInTheDocument();
      expect(screen.getByText('Kaffibarþjóna FIRE')).toBeInTheDocument();
      expect(screen.getByText('Lúxus FIRE')).toBeInTheDocument();
    });

    it('displays taglines for each FIRE type', () => {
      render(
        <ComparisonCards
          calculations={mockCalculations}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      expect(screen.getByText('Lágmarksútgjöld, stysta leiðin til frelsis')).toBeInTheDocument();
      expect(screen.getByText('Klassískt FIRE með þægilegum lífsstíl')).toBeInTheDocument();
    });

    it('renders cards in correct order', () => {
      const { container } = render(
        <ComparisonCards
          calculations={mockCalculations}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      const cards = container.querySelectorAll('[class*="Card"]');
      // Check that they appear in the expected order
      expect(cards.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe('Primary Metrics Display', () => {
    it('displays nest egg for all cards', () => {
      render(
        <ComparisonCards
          calculations={mockCalculations}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      expect(screen.getByText('75.000.000 kr')).toBeInTheDocument();
      expect(screen.getByText('187.200.000 kr')).toBeInTheDocument();
      expect(screen.getByText('360.000.000 kr')).toBeInTheDocument();
    });

    it('displays years to FI for all cards', () => {
      render(
        <ComparisonCards
          calculations={mockCalculations}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      expect(screen.getByText('12,5 ár')).toBeInTheDocument();
      expect(screen.getByText('18,2 ár')).toBeInTheDocument();
      expect(screen.getByText('28,0 ár')).toBeInTheDocument();
    });

    it('displays effort indicators with correct labels', () => {
      render(
        <ComparisonCards
          calculations={mockCalculations}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      expect(screen.getByText('Hófleg')).toBeInTheDocument();
      expect(screen.getByText('Mikil')).toBeInTheDocument();
      expect(screen.getByText('Öfgafull')).toBeInTheDocument();
    });
  });

  describe('Expand/Collapse Functionality', () => {
    it('initially shows primary metrics only', () => {
      render(
        <ComparisonCards
          calculations={mockCalculations}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      // Should not see expanded details initially
      expect(screen.queryByText('Útgjöld/mán:')).not.toBeInTheDocument();
    });

    it('expands card when clicking "Sjá meira"', () => {
      render(
        <ComparisonCards
          calculations={mockCalculations}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      const expandButtons = screen.getAllByText('Sjá meira');
      fireEvent.click(expandButtons[0]);

      // Should now see expanded details
      expect(screen.getByText('Útgjöld/mán:')).toBeInTheDocument();
      expect(screen.getByText('Framvinda:')).toBeInTheDocument();
      expect(screen.getByText('Eftirstöðvar:')).toBeInTheDocument();
    });

    it('collapses card when clicking "Sjá minna"', () => {
      render(
        <ComparisonCards
          calculations={mockCalculations}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      const expandButtons = screen.getAllByText('Sjá meira');
      fireEvent.click(expandButtons[0]);

      // Now collapse
      const collapseButton = screen.getByText('Sjá minna');
      fireEvent.click(collapseButton);

      // Should hide expanded details again
      expect(screen.queryByText('Útgjöld/mán:')).not.toBeInTheDocument();
    });

    it('expands only one card at a time', () => {
      render(
        <ComparisonCards
          calculations={mockCalculations}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      const expandButtons = screen.getAllByText('Sjá meira');

      // Expand first card
      fireEvent.click(expandButtons[0]);
      expect(screen.getAllByText('Útgjöld/mán:').length).toBe(1);

      // Expand second card - should collapse first
      fireEvent.click(expandButtons[1]);
      expect(screen.getAllByText('Útgjöld/mán:').length).toBe(1);
    });
  });

  describe('Expanded Details', () => {
    beforeEach(() => {
      render(
        <ComparisonCards
          calculations={mockCalculations}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      // Expand first card
      const expandButtons = screen.getAllByText('Sjá meira');
      fireEvent.click(expandButtons[0]);
    });

    it('displays monthly expenses in expanded view', () => {
      expect(screen.getByText('Útgjöld/mán:')).toBeInTheDocument();
      expect(screen.getByText('250.000 kr')).toBeInTheDocument();
    });

    it('displays current progress in expanded view', () => {
      expect(screen.getByText('Framvinda:')).toBeInTheDocument();
      expect(screen.getByText('20,0%')).toBeInTheDocument();
    });

    it('displays amount remaining in expanded view', () => {
      expect(screen.getByText('Eftirstöðvar:')).toBeInTheDocument();
      expect(screen.getByText('60.000.000 kr')).toBeInTheDocument();
    });

    it('displays target age in expanded view', () => {
      expect(screen.getByText('Aldur við FIRE:')).toBeInTheDocument();
      expect(screen.getByText('50 ára')).toBeInTheDocument();
    });
  });

  describe('Type-Specific Data', () => {
    it('displays CoastFIRE specific data when expanded', () => {
      render(
        <ComparisonCards
          calculations={mockCalculations}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      // Find and expand CoastFIRE card
      const coastfireCard = screen.getByText('Sjálfvirkt FIRE').closest('[class*="Card"]');
      const expandButton = coastfireCard?.querySelector('button:has-text("Sjá meira")');
      fireEvent.click(expandButton || screen.getAllByText('Sjá meira')[2]);

      expect(screen.getByText('CoastFIRE upplýsingar')).toBeInTheDocument();
      expect(screen.getByText('Coast FI númer:')).toBeInTheDocument();
      expect(screen.getByText('Í coast mode:')).toBeInTheDocument();
      expect(screen.getByText('Nei')).toBeInTheDocument();
    });

    it('displays BaristaFIRE specific data when expanded', () => {
      render(
        <ComparisonCards
          calculations={mockCalculations}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      // Find and expand BaristaFIRE card
      const baristaCard = screen.getByText('Kaffibarþjóna FIRE').closest('[class*="Card"]');
      const expandButton = baristaCard?.querySelector('button');
      // Find the expand button
      const buttons = screen.getAllByText('Sjá meira');
      fireEvent.click(buttons[3]); // BaristaFIRE is 4th card

      expect(screen.getByText('BaristaFIRE upplýsingar')).toBeInTheDocument();
      expect(screen.getByText('Hlutavinna þörf:')).toBeInTheDocument();
      expect(screen.getByText('Sparnaður:')).toBeInTheDocument();
    });
  });

  describe('Selection Functionality', () => {
    it('highlights selected card', () => {
      render(
        <ComparisonCards
          calculations={mockCalculations}
          selectedType="regularfire"
          onSelectType={mockOnSelectType}
        />
      );

      expect(screen.getByText('Valið')).toBeInTheDocument();
    });

    it('calls onSelectType when clicking card header', () => {
      render(
        <ComparisonCards
          calculations={mockCalculations}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      const leanfireHeader = screen.getByText('Sparsamt FIRE').closest('[class*="CardHeader"]');
      fireEvent.click(leanfireHeader!);

      expect(mockOnSelectType).toHaveBeenCalledWith('leanfire');
    });

    it('does not call onSelectType when clicking expand button', () => {
      render(
        <ComparisonCards
          calculations={mockCalculations}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      const expandButton = screen.getAllByText('Sjá meira')[0];
      fireEvent.click(expandButton);

      expect(mockOnSelectType).not.toHaveBeenCalled();
    });
  });

  describe('Effort Indicators', () => {
    it('displays effort progress bars correctly', () => {
      const { container } = render(
        <ComparisonCards
          calculations={mockCalculations}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      const progressBars = container.querySelectorAll('[role="progressbar"]');
      expect(progressBars.length).toBe(5); // One per card
    });

    it('shows correct effort percentage in progress bar', () => {
      const { container } = render(
        <ComparisonCards
          calculations={mockCalculations}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      const progressBars = container.querySelectorAll('[role="progressbar"]');

      // Check extreme effort (fatfire) = 4/4 = 100%
      const extremeBar = Array.from(progressBars).find(
        (bar) => bar.getAttribute('aria-valuenow') === '4'
      );
      expect(extremeBar).toBeInTheDocument();

      // Check moderate effort = 2/4 = 50%
      const moderateBar = Array.from(progressBars).find(
        (bar) => bar.getAttribute('aria-valuenow') === '2'
      );
      expect(moderateBar).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      const { container } = render(
        <ComparisonCards
          calculations={mockCalculations}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      const headings = container.querySelectorAll('h3');
      expect(headings.length).toBe(5); // One per card
    });

    it('has aria-expanded on expand/collapse buttons', () => {
      const { container } = render(
        <ComparisonCards
          calculations={mockCalculations}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      const expandButtons = screen.getAllByText('Sjá meira');
      expandButtons.forEach((button) => {
        expect(button).toHaveAttribute('aria-expanded', 'false');
      });

      // Click first button
      fireEvent.click(expandButtons[0]);
      const collapseButton = screen.getByText('Sjá minna');
      expect(collapseButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('announces selection via screen reader', () => {
      render(
        <ComparisonCards
          calculations={mockCalculations}
          selectedType="leanfire"
          onSelectType={mockOnSelectType}
        />
      );

      const announcement = screen.getByRole('status');
      expect(announcement).toHaveTextContent('Sparsamt FIRE valið');
      expect(announcement).toHaveClass('sr-only');
    });
  });

  describe('Edge Cases', () => {
    it('handles null yearsToFI gracefully', () => {
      const calculationsWithNull = {
        ...mockCalculations,
        leanfire: {
          ...mockCalculations.leanfire,
          yearsToFI: null,
          monthsToFI: null,
        },
      };

      render(
        <ComparisonCards
          calculations={calculationsWithNull as any}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      expect(screen.getByText('Ekki mögulegt')).toBeInTheDocument();
    });

    it('handles missing type-specific data gracefully', () => {
      const calculationsWithoutSpecialData = {
        ...mockCalculations,
        coastfire: {
          ...mockCalculations.coastfire,
          coastData: undefined,
        },
      };

      render(
        <ComparisonCards
          calculations={calculationsWithoutSpecialData as any}
          selectedType={null}
          onSelectType={mockOnSelectType}
        />
      );

      // Expand CoastFIRE card
      const buttons = screen.getAllByText('Sjá meira');
      fireEvent.click(buttons[2]);

      // Should not show CoastFIRE specific section
      expect(screen.queryByText('CoastFIRE upplýsingar')).not.toBeInTheDocument();
    });
  });
});
