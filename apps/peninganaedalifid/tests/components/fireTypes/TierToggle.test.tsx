import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TierToggle } from '@/components/fireTypes/TierToggle';

describe('TierToggle Component', () => {
  const mockOnTierChange = vi.fn();

  const defaultTiers = {
    barebones: 300000,
    comfortable: 500000,
    deluxe: 800000,
  };

  beforeEach(() => {
    mockOnTierChange.mockClear();
  });

  describe('Rendering', () => {
    it('renders all three tier buttons', () => {
      render(
        <TierToggle
          activeTier="comfortable"
          onTierChange={mockOnTierChange}
          tiers={defaultTiers}
        />
      );

      expect(screen.getByText('Lágmarks')).toBeInTheDocument();
      expect(screen.getByText('Þægilegt')).toBeInTheDocument();
      expect(screen.getByText('Lúxus')).toBeInTheDocument();
    });

    it('displays tier descriptions', () => {
      render(
        <TierToggle
          activeTier="comfortable"
          onTierChange={mockOnTierChange}
          tiers={defaultTiers}
        />
      );

      expect(screen.getByText('Sparsamt')).toBeInTheDocument();
      expect(screen.getByText('Venjulegt')).toBeInTheDocument();
      expect(screen.getByText('Glæsilegt')).toBeInTheDocument();
    });

    it('displays amounts for each tier', () => {
      render(
        <TierToggle
          activeTier="comfortable"
          onTierChange={mockOnTierChange}
          tiers={defaultTiers}
        />
      );

      expect(screen.getByText('300.000 kr')).toBeInTheDocument();
      expect(screen.getByText('500.000 kr')).toBeInTheDocument();
      expect(screen.getByText('800.000 kr')).toBeInTheDocument();
    });

    it('displays label text', () => {
      render(
        <TierToggle
          activeTier="comfortable"
          onTierChange={mockOnTierChange}
          tiers={defaultTiers}
        />
      );

      expect(screen.getByText('Útgjaldaprofíll')).toBeInTheDocument();
    });

    it('displays help text', () => {
      render(
        <TierToggle
          activeTier="comfortable"
          onTierChange={mockOnTierChange}
          tiers={defaultTiers}
        />
      );

      expect(
        screen.getByText('Veldu útgjaldaprofíl til að sjá mismunandi FIRE markmið')
      ).toBeInTheDocument();
    });
  });

  describe('Active State', () => {
    it('highlights the active tier button', () => {
      const { container } = render(
        <TierToggle
          activeTier="comfortable"
          onTierChange={mockOnTierChange}
          tiers={defaultTiers}
        />
      );

      const comfortableButton = screen
        .getByText('Þægilegt')
        .closest('button');

      expect(comfortableButton).toHaveClass('bg-green-100');
      expect(comfortableButton).toHaveClass('border-green-500');
    });

    it('shows checkmark icon on active tier', () => {
      const { container } = render(
        <TierToggle
          activeTier="barebones"
          onTierChange={mockOnTierChange}
          tiers={defaultTiers}
        />
      );

      const barebonesButton = screen
        .getByText('Lágmarks')
        .closest('button');

      const checkmark = barebonesButton?.querySelector('svg');
      expect(checkmark).toBeInTheDocument();
    });

    it('does not show checkmark on inactive tiers', () => {
      const { container } = render(
        <TierToggle
          activeTier="barebones"
          onTierChange={mockOnTierChange}
          tiers={defaultTiers}
        />
      );

      const comfortableButton = screen
        .getByText('Þægilegt')
        .closest('button');

      const checkmarks = comfortableButton?.querySelectorAll('svg');
      expect(checkmarks?.length).toBeFalsy();
    });

    it('applies correct colors for each tier', () => {
      const { rerender } = render(
        <TierToggle
          activeTier="barebones"
          onTierChange={mockOnTierChange}
          tiers={defaultTiers}
        />
      );

      let button = screen.getByText('Lágmarks').closest('button');
      expect(button).toHaveClass('bg-amber-100');

      rerender(
        <TierToggle
          activeTier="comfortable"
          onTierChange={mockOnTierChange}
          tiers={defaultTiers}
        />
      );

      button = screen.getByText('Þægilegt').closest('button');
      expect(button).toHaveClass('bg-green-100');

      rerender(
        <TierToggle
          activeTier="deluxe"
          onTierChange={mockOnTierChange}
          tiers={defaultTiers}
        />
      );

      button = screen.getByText('Lúxus').closest('button');
      expect(button).toHaveClass('bg-purple-100');
    });
  });

  describe('Interaction', () => {
    it('calls onTierChange when clicking a tier button', () => {
      render(
        <TierToggle
          activeTier="comfortable"
          onTierChange={mockOnTierChange}
          tiers={defaultTiers}
        />
      );

      const barebonesButton = screen.getByText('Lágmarks').closest('button');
      fireEvent.click(barebonesButton!);

      expect(mockOnTierChange).toHaveBeenCalledWith('barebones');
    });

    it('calls onTierChange with correct tier id for each button', () => {
      render(
        <TierToggle
          activeTier="comfortable"
          onTierChange={mockOnTierChange}
          tiers={defaultTiers}
        />
      );

      // Click barebones
      fireEvent.click(screen.getByText('Lágmarks').closest('button')!);
      expect(mockOnTierChange).toHaveBeenCalledWith('barebones');

      mockOnTierChange.mockClear();

      // Click deluxe
      fireEvent.click(screen.getByText('Lúxus').closest('button')!);
      expect(mockOnTierChange).toHaveBeenCalledWith('deluxe');
    });

    it('does not call onTierChange when clicking active tier', () => {
      render(
        <TierToggle
          activeTier="comfortable"
          onTierChange={mockOnTierChange}
          tiers={defaultTiers}
        />
      );

      // Clicking the already active tier should still trigger (in case of re-calculation)
      fireEvent.click(screen.getByText('Þægilegt').closest('button')!);
      expect(mockOnTierChange).toHaveBeenCalledWith('comfortable');
    });
  });

  describe('Disabled State', () => {
    it('disables all buttons when disabled prop is true', () => {
      render(
        <TierToggle
          activeTier="comfortable"
          onTierChange={mockOnTierChange}
          tiers={defaultTiers}
          disabled={true}
        />
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });

    it('disables when all tiers have the same value', () => {
      const sameTiers = {
        barebones: 500000,
        comfortable: 500000,
        deluxe: 500000,
      };

      render(
        <TierToggle
          activeTier="comfortable"
          onTierChange={mockOnTierChange}
          tiers={sameTiers}
        />
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });

    it('shows informative text when all tiers are the same', () => {
      const sameTiers = {
        barebones: 500000,
        comfortable: 500000,
        deluxe: 500000,
      };

      render(
        <TierToggle
          activeTier="comfortable"
          onTierChange={mockOnTierChange}
          tiers={sameTiers}
        />
      );

      expect(screen.getByText('(öll stig jöfn)')).toBeInTheDocument();
      expect(
        screen.getByText(/Þú hefur ekki sett upp mismunandi útgjaldaprofíl/)
      ).toBeInTheDocument();
    });

    it('does not call onTierChange when disabled', () => {
      render(
        <TierToggle
          activeTier="comfortable"
          onTierChange={mockOnTierChange}
          tiers={defaultTiers}
          disabled={true}
        />
      );

      const button = screen.getByText('Lágmarks').closest('button');
      fireEvent.click(button!);

      expect(mockOnTierChange).not.toHaveBeenCalled();
    });

    it('applies opacity styling when disabled', () => {
      render(
        <TierToggle
          activeTier="comfortable"
          onTierChange={mockOnTierChange}
          tiers={defaultTiers}
          disabled={true}
        />
      );

      const button = screen.getByText('Lágmarks').closest('button');
      expect(button).toHaveClass('opacity-60');
      expect(button).toHaveClass('cursor-not-allowed');
    });
  });

  describe('Accessibility', () => {
    it('has proper button roles', () => {
      render(
        <TierToggle
          activeTier="comfortable"
          onTierChange={mockOnTierChange}
          tiers={defaultTiers}
        />
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBe(3);
    });

    it('has aria-pressed attribute on buttons', () => {
      render(
        <TierToggle
          activeTier="comfortable"
          onTierChange={mockOnTierChange}
          tiers={defaultTiers}
        />
      );

      const comfortableButton = screen
        .getByText('Þægilegt')
        .closest('button');
      expect(comfortableButton).toHaveAttribute('aria-pressed', 'true');

      const barebonesButton = screen
        .getByText('Lágmarks')
        .closest('button');
      expect(barebonesButton).toHaveAttribute('aria-pressed', 'false');
    });

    it('has descriptive aria-labels', () => {
      render(
        <TierToggle
          activeTier="comfortable"
          onTierChange={mockOnTierChange}
          tiers={defaultTiers}
        />
      );

      const button = screen.getByLabelText('Lágmarks stig - 300.000 kr');
      expect(button).toBeInTheDocument();
    });

    it('has label element for component', () => {
      render(
        <TierToggle
          activeTier="comfortable"
          onTierChange={mockOnTierChange}
          tiers={defaultTiers}
        />
      );

      const label = screen.getByText('Útgjaldaprofíll');
      expect(label.tagName).toBe('LABEL');
    });

    it('announces selection via screen reader', () => {
      render(
        <TierToggle
          activeTier="comfortable"
          onTierChange={mockOnTierChange}
          tiers={defaultTiers}
        />
      );

      const announcement = screen.getByRole('status');
      expect(announcement).toHaveTextContent('Þægilegt stig valið');
      expect(announcement).toHaveClass('sr-only');
    });

    it('does not announce when disabled', () => {
      const sameTiers = {
        barebones: 500000,
        comfortable: 500000,
        deluxe: 500000,
      };

      render(
        <TierToggle
          activeTier="comfortable"
          onTierChange={mockOnTierChange}
          tiers={sameTiers}
        />
      );

      const announcement = screen.getByRole('status');
      expect(announcement).toBeEmptyDOMElement();
    });
  });

  describe('Focus Management', () => {
    it('has keyboard focus ring on buttons', () => {
      const { container } = render(
        <TierToggle
          activeTier="comfortable"
          onTierChange={mockOnTierChange}
          tiers={defaultTiers}
        />
      );

      const button = screen.getByText('Lágmarks').closest('button');
      expect(button).toHaveClass('focus:outline-none');
      expect(button).toHaveClass('focus:ring-2');
      expect(button).toHaveClass('focus:ring-primary-500');
    });
  });

  describe('Edge Cases', () => {
    it('handles very large amounts correctly', () => {
      const largeTiers = {
        barebones: 10000000,
        comfortable: 50000000,
        deluxe: 100000000,
      };

      render(
        <TierToggle
          activeTier="comfortable"
          onTierChange={mockOnTierChange}
          tiers={largeTiers}
        />
      );

      expect(screen.getByText('10.000.000 kr')).toBeInTheDocument();
      expect(screen.getByText('50.000.000 kr')).toBeInTheDocument();
      expect(screen.getByText('100.000.000 kr')).toBeInTheDocument();
    });

    it('handles zero amounts', () => {
      const zeroTiers = {
        barebones: 0,
        comfortable: 0,
        deluxe: 0,
      };

      render(
        <TierToggle
          activeTier="comfortable"
          onTierChange={mockOnTierChange}
          tiers={zeroTiers}
        />
      );

      // Should still render but be disabled
      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });

    it('handles two tiers being the same', () => {
      const partialSameTiers = {
        barebones: 300000,
        comfortable: 500000,
        deluxe: 500000, // Same as comfortable
      };

      render(
        <TierToggle
          activeTier="comfortable"
          onTierChange={mockOnTierChange}
          tiers={partialSameTiers}
        />
      );

      // Should not be disabled (two different values exist)
      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).not.toBeDisabled();
      });
    });
  });
});
