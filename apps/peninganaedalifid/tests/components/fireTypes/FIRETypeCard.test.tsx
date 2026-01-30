/**
 * Tests for FIRETypeCard Component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FIRETypeCard } from '@/components/fireTypes/FIRETypeCard';
import { FIRE_TYPE_DEFINITIONS } from '@/lib/constants/fireTypes';
import type { FIRECalculation } from '@/types/fireTypes';

describe('FIRETypeCard', () => {
  const leanFireDef = FIRE_TYPE_DEFINITIONS.find((d) => d.id === 'leanfire')!;
  const regularFireDef = FIRE_TYPE_DEFINITIONS.find((d) => d.id === 'regularfire')!;

  const mockCalculation: FIRECalculation = {
    fireTypeId: 'leanfire',
    monthlyExpenses: 250_000,
    annualExpenses: 3_000_000,
    multiplier: 25,
    fiNumber: 75_000_000,
    yearsToFI: 10.5,
    monthsToFI: 126,
    targetDate: new Date('2036-06-15'),
    targetAge: 45,
    currentProgress: 33.3,
    amountRemaining: 50_000_000,
    effortLevel: 'moderate',
    feasibility: 75,
  };

  describe('Basic Rendering', () => {
    it('renders FIRE type name in Icelandic and English', () => {
      render(<FIRETypeCard definition={leanFireDef} />);

      expect(screen.getByText('Sparsamt FIRE')).toBeInTheDocument();
      expect(screen.getByText('LeanFIRE')).toBeInTheDocument();
    });

    it('renders tagline', () => {
      render(<FIRETypeCard definition={leanFireDef} />);

      expect(screen.getByText('Lágmarksútgjöld, stysta leiðin til frelsis')).toBeInTheDocument();
    });

    it('renders description', () => {
      render(<FIRETypeCard definition={leanFireDef} />);

      expect(screen.getByText(/LeanFIRE byggir á mjög lágum útgjöldum/)).toBeInTheDocument();
    });

    it('renders icon', () => {
      render(<FIRETypeCard definition={leanFireDef} />);

      expect(screen.getByText(leanFireDef.icon)).toBeInTheDocument();
    });

    it('renders "Ideal for" section with first 3 items', () => {
      render(<FIRETypeCard definition={leanFireDef} />);

      expect(screen.getByText('Hentar best fyrir:')).toBeInTheDocument();
      expect(screen.getByText('Fólk með náttúrulega lágar þarfir')).toBeInTheDocument();
    });
  });

  describe('Personalized Calculations', () => {
    it('displays personalized numbers when calculation provided', () => {
      render(<FIRETypeCard definition={leanFireDef} calculation={mockCalculation} />);

      expect(screen.getByText('Þínar tölur')).toBeInTheDocument();
      expect(screen.getByText(/75\.000\.000/)).toBeInTheDocument(); // FI number
      expect(screen.getByText(/250\.000/)).toBeInTheDocument(); // Monthly expenses
    });

    it('displays years to FI in readable format', () => {
      render(<FIRETypeCard definition={leanFireDef} calculation={mockCalculation} />);

      expect(screen.getByText(/10 ár og 6 mánuðir/)).toBeInTheDocument();
    });

    it('displays progress percentage', () => {
      render(<FIRETypeCard definition={leanFireDef} calculation={mockCalculation} />);

      expect(screen.getByText(/33\.3%/)).toBeInTheDocument();
    });

    it('does not display personalized section without calculation', () => {
      render(<FIRETypeCard definition={leanFireDef} />);

      expect(screen.queryByText('Þínar tölur')).not.toBeInTheDocument();
    });
  });

  describe('BaristaFIRE Specific Data', () => {
    it('displays part-time income needed for BaristaFIRE', () => {
      const baristaCalculation: FIRECalculation = {
        ...mockCalculation,
        fireTypeId: 'baristafire',
        baristaData: {
          partTimeIncomeNeeded: 150_000,
          hoursPerWeekNeeded: 20,
          reducedFINumber: 60_000_000,
          fullFINumber: 90_000_000,
          savings: 30_000_000,
        },
      };

      render(
        <FIRETypeCard
          definition={FIRE_TYPE_DEFINITIONS.find((d) => d.id === 'baristafire')!}
          calculation={baristaCalculation}
        />
      );

      expect(screen.getByText(/150\.000 kr\/mán í hlutavinnu/)).toBeInTheDocument();
    });
  });

  describe('CoastFIRE Specific Data', () => {
    it('displays coast status for CoastFIRE', () => {
      const coastCalculation: FIRECalculation = {
        ...mockCalculation,
        fireTypeId: 'coastfire',
        coastData: {
          coastFINumber: 40_000_000,
          isCoasting: false,
          yearsUntilCoast: 5.5,
          coastDate: new Date('2031-06-15'),
          workIncomeNeeded: 200_000,
        },
      };

      render(
        <FIRETypeCard
          definition={FIRE_TYPE_DEFINITIONS.find((d) => d.id === 'coastfire')!}
          calculation={coastCalculation}
        />
      );

      expect(screen.getByText(/Coast eftir 5 ár og 6 mánuðir/)).toBeInTheDocument();
    });

    it('displays "already coasting" message when applicable', () => {
      const coastCalculation: FIRECalculation = {
        ...mockCalculation,
        fireTypeId: 'coastfire',
        coastData: {
          coastFINumber: 40_000_000,
          isCoasting: true,
          yearsUntilCoast: null,
          coastDate: null,
          workIncomeNeeded: 200_000,
        },
      };

      render(
        <FIRETypeCard
          definition={FIRE_TYPE_DEFINITIONS.find((d) => d.id === 'coastfire')!}
          calculation={coastCalculation}
        />
      );

      expect(screen.getByText(/Þú ert nú þegar kominn á Coast!/)).toBeInTheDocument();
    });
  });

  describe('Recommendations', () => {
    it('shows "Mælt með" badge for rank 1', () => {
      render(<FIRETypeCard definition={leanFireDef} isRecommended={true} rank={1} />);

      expect(screen.getByText('Mælt með')).toBeInTheDocument();
    });

    it('shows "#2 valkostur" badge for rank 2', () => {
      render(<FIRETypeCard definition={leanFireDef} isRecommended={true} rank={2} />);

      expect(screen.getByText('#2 valkostur')).toBeInTheDocument();
    });

    it('does not show badge when not recommended', () => {
      render(<FIRETypeCard definition={leanFireDef} isRecommended={false} />);

      expect(screen.queryByText('Mælt með')).not.toBeInTheDocument();
    });
  });

  describe('Selection State', () => {
    it('shows selected indicator when isSelected=true', () => {
      render(<FIRETypeCard definition={leanFireDef} isSelected={true} />);

      // Check for checkmark icon (we can't easily check SVG, so check button text)
      expect(screen.getByText('Valið')).toBeInTheDocument();
    });

    it('shows "Velja þetta" button when not selected', () => {
      render(<FIRETypeCard definition={leanFireDef} isSelected={false} />);

      expect(screen.getByText('Velja þetta')).toBeInTheDocument();
    });

    it('disables select button when already selected', () => {
      render(<FIRETypeCard definition={leanFireDef} isSelected={true} />);

      const selectButton = screen.getByText('Valið');
      expect(selectButton).toBeDisabled();
    });
  });

  describe('Expandable Details', () => {
    it('hides details by default', () => {
      render(<FIRETypeCard definition={leanFireDef} />);

      expect(screen.queryByText('Kostir')).not.toBeInTheDocument();
      expect(screen.queryByText('Gallar')).not.toBeInTheDocument();
    });

    it('shows "Sjá ítarlegar upplýsingar" button when collapsed', () => {
      render(<FIRETypeCard definition={leanFireDef} />);

      expect(screen.getByText('Sjá ítarlegar upplýsingar')).toBeInTheDocument();
    });

    it('expands details when toggle clicked', () => {
      render(<FIRETypeCard definition={leanFireDef} />);

      const toggleButton = screen.getByText('Sjá ítarlegar upplýsingar');
      fireEvent.click(toggleButton);

      expect(screen.getByText('Kostir')).toBeInTheDocument();
      expect(screen.getByText('Gallar')).toBeInTheDocument();
      expect(screen.getByText('Hentar ekki fyrir:')).toBeInTheDocument();
    });

    it('shows all pros when expanded', () => {
      render(<FIRETypeCard definition={leanFireDef} />);

      const toggleButton = screen.getByText('Sjá ítarlegar upplýsingar');
      fireEvent.click(toggleButton);

      leanFireDef.pros.forEach((pro) => {
        expect(screen.getByText(pro)).toBeInTheDocument();
      });
    });

    it('shows all cons when expanded', () => {
      render(<FIRETypeCard definition={leanFireDef} />);

      const toggleButton = screen.getByText('Sjá ítarlegar upplýsingar');
      fireEvent.click(toggleButton);

      leanFireDef.cons.forEach((con) => {
        expect(screen.getByText(con)).toBeInTheDocument();
      });
    });

    it('collapses details when toggle clicked again', () => {
      render(<FIRETypeCard definition={leanFireDef} />);

      const toggleButton = screen.getByText('Sjá ítarlegar upplýsingar');
      fireEvent.click(toggleButton); // Expand
      fireEvent.click(screen.getByText('Sjá minna')); // Collapse

      expect(screen.queryByText('Kostir')).not.toBeInTheDocument();
    });
  });

  describe('Callbacks', () => {
    it('calls onSelect with type ID when select button clicked', () => {
      const onSelect = vi.fn();
      render(<FIRETypeCard definition={leanFireDef} onSelect={onSelect} />);

      const selectButton = screen.getByText('Velja þetta');
      fireEvent.click(selectButton);

      expect(onSelect).toHaveBeenCalledWith('leanfire');
    });

    it('calls onLearnMore with type ID when learn more clicked', () => {
      const onLearnMore = vi.fn();
      render(<FIRETypeCard definition={leanFireDef} onLearnMore={onLearnMore} />);

      const learnMoreButton = screen.getByText('Lesa meira');
      fireEvent.click(learnMoreButton);

      expect(onLearnMore).toHaveBeenCalledWith('leanfire');
    });

    it('does not call onSelect when button is disabled', () => {
      const onSelect = vi.fn();
      render(<FIRETypeCard definition={leanFireDef} isSelected={true} onSelect={onSelect} />);

      const selectButton = screen.getByText('Valið');
      fireEvent.click(selectButton);

      expect(onSelect).not.toHaveBeenCalled();
    });
  });

  describe('Different FIRE Types', () => {
    it('applies correct color scheme for each type', () => {
      const { container, rerender } = render(<FIRETypeCard definition={leanFireDef} />);

      // Check that color classes are applied (amber for LeanFIRE)
      expect(container.querySelector('.bg-amber-50')).toBeInTheDocument();

      // Rerender with RegularFIRE (green)
      rerender(<FIRETypeCard definition={regularFireDef} />);
      expect(container.querySelector('.bg-green-50')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles null yearsToFI', () => {
      const impossibleCalculation: FIRECalculation = {
        ...mockCalculation,
        yearsToFI: null,
        monthsToFI: null,
      };

      render(<FIRETypeCard definition={leanFireDef} calculation={impossibleCalculation} />);

      expect(screen.getByText('Óvíst')).toBeInTheDocument();
    });

    it('handles Infinity yearsToFI', () => {
      const impossibleCalculation: FIRECalculation = {
        ...mockCalculation,
        yearsToFI: Infinity,
      };

      render(<FIRETypeCard definition={leanFireDef} calculation={impossibleCalculation} />);

      expect(screen.getByText('Óvíst')).toBeInTheDocument();
    });

    it('formats years less than 1 correctly', () => {
      const quickCalculation: FIRECalculation = {
        ...mockCalculation,
        yearsToFI: 0.5,
        monthsToFI: 6,
      };

      render(<FIRETypeCard definition={leanFireDef} calculation={quickCalculation} />);

      expect(screen.getByText('6 mánuðir')).toBeInTheDocument();
    });
  });
});
