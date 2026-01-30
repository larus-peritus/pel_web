import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TierSelector } from '@/components/expenseBaseline/TierSelector';
import type { ExpenseTier } from '@/types/expenseBaseline';

describe('TierSelector', () => {
  const mockOnSelectTier = vi.fn();
  const mockTierExpenses = {
    barebones: 250000,
    comfortable: 520000,
    deluxe: 1000000,
  };

  beforeEach(() => {
    mockOnSelectTier.mockClear();
  });

  it('renders all three tier options', () => {
    render(
      <TierSelector
        selectedTier={null}
        onSelectTier={mockOnSelectTier}
      />
    );

    expect(screen.getByRole('radio', { name: /lágmarks/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /þægilegt/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /lúxus/i })).toBeInTheDocument();
  });

  it('shows expense amounts when showExpenseAmount is true', () => {
    render(
      <TierSelector
        selectedTier={null}
        onSelectTier={mockOnSelectTier}
        showExpenseAmount
        tierExpenses={mockTierExpenses}
      />
    );

    expect(screen.getByText(/250\.000 kr\/mán/i)).toBeInTheDocument();
    expect(screen.getByText(/520\.000 kr\/mán/i)).toBeInTheDocument();
    expect(screen.getByText(/1\.000\.000 kr\/mán/i)).toBeInTheDocument();
  });

  it('does not show expense amounts when showExpenseAmount is false', () => {
    render(
      <TierSelector
        selectedTier={null}
        onSelectTier={mockOnSelectTier}
        showExpenseAmount={false}
        tierExpenses={mockTierExpenses}
      />
    );

    expect(screen.queryByText(/kr\/mán/i)).not.toBeInTheDocument();
  });

  it('calls onSelectTier when a tier is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TierSelector
        selectedTier={null}
        onSelectTier={mockOnSelectTier}
      />
    );

    await user.click(screen.getByRole('radio', { name: /þægilegt/i }));
    expect(mockOnSelectTier).toHaveBeenCalledWith('comfortable');
  });

  it('marks selected tier with aria-checked', () => {
    render(
      <TierSelector
        selectedTier="comfortable"
        onSelectTier={mockOnSelectTier}
      />
    );

    const comfortableButton = screen.getByRole('radio', { name: /þægilegt/i });
    expect(comfortableButton).toHaveAttribute('aria-checked', 'true');

    const barebonesButton = screen.getByRole('radio', { name: /lágmarks/i });
    expect(barebonesButton).toHaveAttribute('aria-checked', 'false');
  });

  it('applies compact styles when compact is true', () => {
    const { container } = render(
      <TierSelector
        selectedTier={null}
        onSelectTier={mockOnSelectTier}
        compact
      />
    );

    const grid = container.querySelector('[role="radiogroup"]');
    expect(grid).toHaveClass('grid-cols-1');
  });

  it('applies responsive grid when compact is false', () => {
    const { container } = render(
      <TierSelector
        selectedTier={null}
        onSelectTier={mockOnSelectTier}
        compact={false}
      />
    );

    const grid = container.querySelector('[role="radiogroup"]');
    expect(grid).toHaveClass('sm:grid-cols-3');
  });

  it('disables all tier buttons when disabled is true', () => {
    render(
      <TierSelector
        selectedTier={null}
        onSelectTier={mockOnSelectTier}
        disabled
      />
    );

    const barebonesButton = screen.getByRole('radio', { name: /lágmarks/i });
    const comfortableButton = screen.getByRole('radio', { name: /þægilegt/i });
    const deluxeButton = screen.getByRole('radio', { name: /lúxus/i });

    expect(barebonesButton).toBeDisabled();
    expect(comfortableButton).toBeDisabled();
    expect(deluxeButton).toBeDisabled();
  });

  it('does not call onSelectTier when disabled', async () => {
    const user = userEvent.setup();
    render(
      <TierSelector
        selectedTier={null}
        onSelectTier={mockOnSelectTier}
        disabled
      />
    );

    await user.click(screen.getByRole('radio', { name: /þægilegt/i }));
    expect(mockOnSelectTier).not.toHaveBeenCalled();
  });

  it('has proper radiogroup role and label', () => {
    render(
      <TierSelector
        selectedTier={null}
        onSelectTier={mockOnSelectTier}
      />
    );

    const radiogroup = screen.getByRole('radiogroup', { name: /veldu útgjaldagrunn/i });
    expect(radiogroup).toBeInTheDocument();
  });

  it('cycles through all tiers correctly', async () => {
    const user = userEvent.setup();
    const tiers: ExpenseTier[] = ['barebones', 'comfortable', 'deluxe'];

    render(
      <TierSelector
        selectedTier={null}
        onSelectTier={mockOnSelectTier}
      />
    );

    for (const tier of tiers) {
      const labels = {
        barebones: /lágmarks/i,
        comfortable: /þægilegt/i,
        deluxe: /lúxus/i,
      };

      await user.click(screen.getByRole('radio', { name: labels[tier] }));
      expect(mockOnSelectTier).toHaveBeenCalledWith(tier);
    }

    expect(mockOnSelectTier).toHaveBeenCalledTimes(3);
  });
});
